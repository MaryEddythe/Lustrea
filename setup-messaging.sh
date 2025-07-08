#!/bin/bash

echo "Setting up messaging and image upload features..."

# Navigate to Laravel backend
cd laravel-backend

# Create uploads directory for design images
mkdir -p public/uploads/design_images
chmod 755 public/uploads/design_images

# Run migrations
echo "Running database migrations..."
php artisan migrate

# Run seeders to populate sample data
echo "Seeding database with sample data..."
php artisan db:seed

# Clear caches
echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear

echo ""
echo "✅ Setup complete!"
echo ""
echo "New features added:"
echo "📸 Design image upload in booking form"
echo "💬 Messaging system between clients and admin"
echo "📋 Messages management in admin dashboard"
echo ""
echo "To start the Laravel backend:"
echo "  cd laravel-backend && php artisan serve"
echo ""
echo "To start the Next.js frontend:"
echo "  npm run dev"
