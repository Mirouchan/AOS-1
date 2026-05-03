import requests
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderItemSerializer



class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        user_id = token["user_id"]

        items_data = request.data.get("items", [])

        if not items_data:
            return Response({"error": "No items provided"}, status=400)

        # Validate items
        serializer = CreateOrderItemSerializer(data=items_data, many=True)
        serializer.is_valid(raise_exception=True)
        items = serializer.validated_data

        product_ids = [item["product_id"] for item in items]

        #  Call product-service
        try:
            res = requests.post(
                "http://product-service:8000/api/products/bulk/",
                json={"ids": product_ids},
                timeout=5
            )

            if res.status_code != 200:
                return Response(
                    {"error": "Product service error"},
                    status=500
                )

            products = res.json()

        except requests.exceptions.RequestException:
            return Response(
                {"error": "Product service unavailable"},
                status=500
            )

        products_dict = {p["id"]: p for p in products}

        # Create order safely
        with transaction.atomic():
            order = Order.objects.create(user_id=user_id)

            for item in items:
                product = products_dict.get(item["product_id"])

                if not product:
                    return Response(
                        {"error": f"Product {item['product_id']} not found"},
                        status=400
                    )

                OrderItem.objects.create(
                    order=order,
                    product_id=product["id"],
                    quantity=item["quantity"],
                    price=product["price"]
                )

        return Response({
            "message": "Order created",
            "order_id": str(order.id)
        }, status=201)



class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.auth["user_id"]
        orders = Order.objects.filter(user_id=user_id)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)



class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user_id = request.auth["user_id"]
        order = get_object_or_404(Order, pk=pk)

        if order.user_id != user_id:
            return Response({"error": "Unauthorized"}, status=403)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def patch(self, request, pk):
        user_id = request.auth["user_id"]
        order = get_object_or_404(Order, pk=pk)

        if order.user_id != user_id:
            return Response({"error": "Unauthorized"}, status=403)

        status_value = request.data.get("status")

        if status_value:
            order.status = status_value
            order.save()

        return Response({"message": "Order updated"})

    def delete(self, request, pk):
        user_id = request.auth["user_id"]
        order = get_object_or_404(Order, pk=pk)

        #  Check ownership
        if order.user_id != user_id:
            return Response({"error": "Unauthorized"}, status=403)

        #  Only pending orders can be deleted
        if order.status != "pending":
            return Response({"error": "Cannot delete this order"}, status=400)

        order.delete()
        return Response(status=204)