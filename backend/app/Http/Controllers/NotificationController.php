<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($n) {
                return [
                    'id' => (string)$n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'timestamp' => $n->created_at->diffForHumans(),
                    'read' => (bool)$n->read,
                    'icon' => $n->icon,
                    'color' => $n->color,
                ];
            });

        return response()->json([
            'data' => $notifications,
            'unread_count' => $notifications->where('read', false)->count(),
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllAsRead()
    {
        auth()->user()
            ->notifications()
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'All marked as read']);
    }

    public function clearAll()
    {
        auth()->user()->notifications()->delete();

        return response()->json(['message' => 'All cleared']);
    }

    public function unreadCount()
    {
        $count = auth()->user()
            ->notifications()
            ->where('read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
