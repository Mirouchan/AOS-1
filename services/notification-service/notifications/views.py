from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification





class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = self.authenticate(request)
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
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.status = 'read'
            notification.read_at = timezone.now()
            notification.save()
            return JsonResponse({"message": "✅ Notification marquée comme lue"})
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notification non trouvée"}, status=404)


class DeleteNotificationView(APIView):
     permission_classes = [IsAuthenticated]

     def delete(self, request, notification_id):
        user_id = self.authenticate(request)
        if not user_id:
            return JsonResponse({"error": "Token invalide ou manquant"}, status=401)
        
        try:
            notification = Notification.objects.get(id=notification_id, user_id=user_id)
            notification.delete()
            return JsonResponse({"message": "🗑️ Notification supprimée"})
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notification non trouvée"}, status=404)
        

class HealthCheckView(View):
    def get(self, request):
        return JsonResponse({"status": "healthy", "service": "notification-service"})