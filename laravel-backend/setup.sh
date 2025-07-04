#!/bin/bash

# Laravel Backend Setup Script for Luxe Nails Studio

echo "🎯 Setting up Luxe Nails Studio Laravel Backend..."

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.1 or higher."
    exit 1
fi

echo "📦 Installing Composer dependencies..."
composer install

echo "🔧 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created from .env.example"
else
    echo "⚠️  Environment file already exists"
fi

echo "🔑 Generating application key..."
php artisan key:generate

echo "🗄️  Setting up database..."
read -p "Enter your database name (default: luxe_nails): " db_name
db_name=${db_name:-luxe_nails}

read -p "Enter your database username (default: root): " db_user
db_user=${db_user:-root}

read -s -p "Enter your database password: " db_password
echo

# Update .env file with database credentials
sed -i "s/DB_DATABASE=.*/DB_DATABASE=$db_name/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=$db_user/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$db_password/" .env

echo "🚀 Running database migrations..."
php artisan migrate

echo "🌱 Seeding database with initial data..."
php artisan db:seed

echo "🔐 Publishing Sanctum configuration..."
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

echo "🔗 Creating symbolic link for storage..."
php artisan storage:link

echo "🧹 Clearing application cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "✅ Laravel backend setup completed successfully!"
echo ""
echo "🎉 Your Luxe Nails Studio API is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: php artisan serve"
echo "2. Your API will be available at: http://localhost:8000"
echo "3. Admin credentials:"
echo "   - Email: admin@luxenails.com"
echo "   - Password: admin123"
echo ""
echo "📚 API Documentation:"
echo "   - Health Check: GET /api/health"
echo "   - Services: GET /api/v1/services"
echo "   - Book Appointment: POST /api/v1/appointments"
echo "   - Admin Login: POST /api/v1/admin/login"
echo ""
echo "🔧 Don't forget to:"
echo "   - Update FRONTEND_URL in .env for CORS"
echo "   - Configure your mail settings for notifications"
echo "   - Set up your production database credentials"
