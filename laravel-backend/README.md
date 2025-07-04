# Luxe Nails Studio - Laravel API Backend

A comprehensive Laravel API backend for the Luxe Nails Studio appointment booking system.

## 🚀 Features

- **RESTful API** with proper HTTP status codes and JSON responses
- **Authentication** using Laravel Sanctum for admin users
- **Appointment Management** with real-time availability checking
- **Service Management** with categories and pricing
- **Gallery Management** for showcasing nail art samples
- **Admin Dashboard** with comprehensive statistics
- **Database Seeding** with sample data
- **CORS Configuration** for frontend integration
- **Input Validation** and error handling
- **Docker Support** for easy deployment

## 📋 Requirements

- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Redis (optional, for caching)

## 🛠️ Installation

### Quick Setup (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd laravel-backend
   \`\`\`

2. **Run the setup script**
   \`\`\`bash
   chmod +x setup.sh
   ./setup.sh
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   php artisan serve
   \`\`\`

### Manual Setup

1. **Install dependencies**
   \`\`\`bash
   composer install
   \`\`\`

2. **Environment setup**
   \`\`\`bash
   cp .env.example .env
   php artisan key:generate
   \`\`\`

3. **Configure database in .env**
   \`\`\`env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=luxe_nails
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   \`\`\`

4. **Run migrations and seeders**
   \`\`\`bash
   php artisan migrate
   php artisan db:seed
   \`\`\`

5. **Publish Sanctum configuration**
   \`\`\`bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   \`\`\`

## 🐳 Docker Setup

1. **Build and start containers**
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

2. **Run migrations inside container**
   \`\`\`bash
   docker-compose exec app php artisan migrate --seed
   \`\`\`

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:8000/api/v1
\`\`\`

### Public Endpoints

#### Services
- `GET /services` - Get all active services
- `GET /services/categories` - Get service categories
- `GET /services/{id}` - Get specific service

#### Appointments
- `POST /appointments` - Book new appointment
- `GET /appointments/available-slots?date=YYYY-MM-DD` - Get available time slots

#### Gallery
- `GET /gallery` - Get gallery items
- `GET /gallery/categories` - Get gallery categories
- `GET /gallery/featured` - Get featured gallery items

### Admin Endpoints (Requires Authentication)

#### Authentication
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin/me` - Get admin profile

#### Appointment Management
- `GET /admin/appointments` - Get all appointments (with filters)
- `GET /admin/appointments/statistics` - Get appointment statistics
- `PUT /admin/appointments/{id}` - Update appointment
- `DELETE /admin/appointments/{id}` - Delete appointment

#### Service Management
- `POST /admin/services` - Create new service
- `PUT /admin/services/{id}` - Update service
- `DELETE /admin/services/{id}` - Delete service

#### Gallery Management
- `POST /admin/gallery` - Add gallery item
- `PUT /admin/gallery/{id}` - Update gallery item
- `DELETE /admin/gallery/{id}` - Delete gallery item

### Request Examples

#### Book Appointment
\`\`\`bash
curl -X POST http://localhost:8000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "service_id": 1,
    "appointment_date": "2024-01-20",
    "appointment_time": "14:30",
    "notes": "First time client"
  }'
\`\`\`

#### Admin Login
\`\`\`bash
curl -X POST http://localhost:8000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@luxenails.com",
    "password": "admin123"
  }'
\`\`\`

## 🔐 Default Admin Credentials

- **Email**: admin@luxenails.com
- **Password**: admin123

## 🗄️ Database Schema

### Services Table
- `id` - Primary key
- `name` - Service name
- `description` - Service description
- `duration` - Duration in minutes
- `price` - Service price
- `features` - JSON array of features
- `category` - Service category
- `active` - Boolean status

### Appointments Table
- `id` - Primary key
- `name` - Customer name
- `email` - Customer email
- `phone` - Customer phone
- `service_id` - Foreign key to services
- `appointment_date` - Appointment date
- `appointment_time` - Appointment time
- `status` - Enum: pending, confirmed, completed, cancelled
- `notes` - Optional notes

### Gallery Table
- `id` - Primary key
- `title` - Image title
- `category` - Image category
- `image_url` - Image URL
- `description` - Optional description
- `featured` - Boolean featured status
- `sort_order` - Display order

## 🚀 Deployment

### Production Environment Variables

\`\`\`env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-api-domain.com

DB_CONNECTION=mysql
DB_HOST=your-production-db-host
DB_DATABASE=your-production-db-name
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password

FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

### Deployment Commands

\`\`\`bash
# Optimize for production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed database (first time only)
php artisan db:seed --force
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
\`\`\`

## 📝 API Response Format

All API responses follow this consistent format:

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
\`\`\`

Error responses:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
\`\`\`

## 🔧 Configuration

### CORS Configuration
Update `config/cors.php` to include your frontend domain:

\`\`\`php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
    'https://your-frontend-domain.com'
],
\`\`\`

### Rate Limiting
API endpoints are rate-limited to prevent abuse. Default limits:
- Public endpoints: 60 requests per minute
- Admin endpoints: 100 requests per minute

## 📞 Support

For support and questions, please contact:
- Email: support@luxenails.com
- Documentation: [API Docs](https://api-docs.luxenails.com)

## 📄 License

This project is licensed under the MIT License.
\`\`\`

## 🎯 Complete Laravel Backend Summary

I've created a comprehensive Laravel backend with the following structure:

### 📁 **File Organization**
\`\`\`
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── ServiceController.php
│   │   │   ├── AppointmentController.php
│   │   │   ├── AdminController.php
│   │   │   └── GalleryController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   └── Models/
│       ├── Service.php
│       ├── Appointment.php
│       ├── Admin.php
│       ├── Gallery.php
│       └── TimeSlot.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── config/
│   ├── cors.php
│   └── sanctum.php
├── setup.sh
├── Dockerfile
├── docker-compose.yml
└── README.md
\`\`\`

### 🚀 **Key Features**

✅ **Complete API Endpoints**
- Public booking system
- Admin authentication with Sanctum
- CRUD operations for all entities
- Real-time availability checking

✅ **Database Design**
- Proper relationships and constraints
- Optimized indexes for performance
- Comprehensive seeders with sample data

✅ **Security & Validation**
- Input validation for all endpoints
- Admin middleware protection
- CORS configuration for frontend

✅ **Developer Experience**
- Automated setup script
- Docker support for easy deployment
- Comprehensive documentation
- Consistent API response format

✅ **Production Ready**
- Error handling and logging
- Rate limiting
- Caching support
- Deployment configurations

### 🛠️ **Quick Start Commands**

\`\`\`bash
# Setup the backend
cd laravel-backend
chmod +x setup.sh
./setup.sh

# Start development server
php artisan serve

# API will be available at http://localhost:8000
\`\`\`

### 🔐 **Admin Access**
- **URL**: `POST /api/v1/admin/login`
- **Email**: admin@luxenails.com
- **Password**: admin123

This Laravel backend provides a solid foundation for the nail salon appointment system with all the features requested! 🎉
