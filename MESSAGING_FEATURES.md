# Messaging and Image Upload Features

This document describes the new features added to the Luxe Nails Studio booking system.

## 🚀 New Features

### 1. Design Reference Image Upload

- **Location**: Booking form during appointment creation
- **Purpose**: Clients can upload reference images of their desired nail designs
- **File Types**: PNG, JPG, GIF (up to 10MB)
- **Storage**: Images are stored in `laravel-backend/public/uploads/design_images/`

### 2. Client-Admin Messaging System

- **Real-time communication** between clients and admin
- **Appointment-specific conversations** linked to each booking
- **Message history** preserved for future reference
- **Read/unread status** tracking

## 📁 Files Added/Modified

### Frontend Components

- `components/booking/image-upload.tsx` - Image upload component
- `components/messaging/chat-interface.tsx` - Chat UI component
- `components/admin/messages-manager.tsx` - Admin message management
- `components/booking/booking-success-with-chat.tsx` - Success page with chat
- `components/booking/booking-form.tsx` - Updated with image upload
- `components/pages/booking-page.tsx` - Updated booking flow
- `components/admin/admin-dashboard.tsx` - Added Messages tab

### Backend Files

- `app/Models/Message.php` - Message model
- `app/Http/Controllers/Api/MessageController.php` - Message API
- `database/migrations/2024_01_01_000006_add_design_image_to_appointments_table.php`
- `database/migrations/2024_01_01_000007_create_messages_table.php`
- `database/seeders/MessageSeeder.php` - Sample message data
- `routes/api.php` - Updated with message routes

## 🔧 Setup Instructions

1. **Run the setup script**:

   ```bash
   ./setup-messaging.sh
   ```

2. **Or manually setup**:
   ```bash
   cd laravel-backend
   php artisan migrate
   php artisan db:seed
   mkdir -p public/uploads/design_images
   chmod 755 public/uploads/design_images
   ```

## 🎯 How to Use

### For Clients

#### Image Upload

1. Go to the booking page
2. Fill in your details
3. Upload a design reference image (optional)
4. Complete your booking

#### Messaging

1. After successful booking, click "Chat with Admin"
2. Send messages about your appointment
3. Receive responses from the admin

### For Admin

#### View Messages

1. Login to admin dashboard
2. Click on the "Messages" tab
3. See all conversations with unread counts
4. Click on any conversation to reply

#### Message Management

- View all client conversations
- See unread message counts
- Reply to client messages
- Mark conversations as read

## 🔗 API Endpoints

### Public (Client) Routes

- `GET /api/v1/appointments/{id}/messages` - Get conversation
- `POST /api/v1/appointments/{id}/messages` - Send message
- `PUT /api/v1/messages/{id}/read` - Mark message as read

### Admin Routes

- `GET /api/v1/admin/messages/conversations` - Get all conversations
- `GET /api/v1/admin/messages/unread-count` - Get unread count
- `PUT /api/v1/admin/appointments/{id}/messages/read-all` - Mark all as read

## 📝 Database Schema

### Messages Table

- `id` - Primary key
- `appointment_id` - Foreign key to appointments
- `sender_type` - 'client' or 'admin'
- `sender_name` - Name of the sender
- `message` - Message content
- `is_read` - Read status
- `created_at` - Message timestamp

### Appointments Table (Updated)

- `design_image` - Path to uploaded design reference image

## 🎨 UI/UX Features

### Image Upload

- Drag and drop support
- Image preview before upload
- File size and type validation
- Progress feedback

### Chat Interface

- Clean, modern chat UI
- Real-time appearance
- Message timestamps
- Sender identification
- Mobile-responsive design

### Admin Dashboard

- Conversation list with previews
- Unread message badges
- Search functionality
- Easy navigation between conversations

## 🔒 Security Considerations

- File upload validation (type, size)
- SQL injection protection via Eloquent ORM
- Input sanitization for messages
- Admin authentication required for admin routes

## 🚀 Future Enhancements

- Real-time notifications using WebSockets
- Image compression for uploads
- Message attachments
- Push notifications
- Message search functionality
- Conversation archiving
