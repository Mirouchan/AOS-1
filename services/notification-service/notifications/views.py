from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer


class CreateNotificationView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        # Use the correct field names from your model
        data = {
            'user_id': request.user.id,
            'content': request.data.get('message', request.data.get('content', '')),
            'event_type': request.data.get('type', request.data.get('event_type', 'order')),
            'status': 'unread'  # Default to unread
        }
        
        try:
            notification = Notification.objects.create(**data)
            return Response({
                "id": notification.id,
                "content": notification.content,
                "event_type": notification.event_type,
                "status": notification.status,
                "created_at": notification.created_at
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error creating notification:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_id = user.id
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        notifications = Notification.objects.filter(user_id=user_id).values(
            'id', 'content', 'status', 'event_type', 'created_at', 'read_at'
        )
        return JsonResponse({
            "notifications": list(notifications),
            "count": notifications.count()
        })


class UnreadNotificationsView(APIView):
 permission_classes = [IsAuthenticated]

 def get(self, request):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        notifications = Notification.objects.filter(user_id=user_id, status='unread').values(
            'id', 'content', 'event_type', 'created_at'
        )
        return JsonResponse({
            "unread_count": notifications.count(),
            "notifications": list(notifications)
        })


class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, notification_id):
        user_id = request.user.id
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.status = 'read'
            notification.read_at = timezone.now()
            notification.save()
            return Response({"message": "Notification marked as read"})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)


class DeleteNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):
        user_id = request.user.id
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.delete()
            return Response({"message": "Notification deleted"})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)
        

class HealthCheckView(View):
    def get(self, request):
        return JsonResponse({"status": "healthy", "service": "notification-service"})