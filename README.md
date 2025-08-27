# Shahan Ahmed - Portfolio (Next.js)

A modern, full-stack portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. This project showcases professional work, skills, and provides an admin dashboard for content management.

## 🚀 Features

### Frontend
- **Modern Design**: Dark theme with beautiful gradients and animations
- **Responsive**: Mobile-first design that works on all devices
- **Fast Performance**: Optimized with Next.js 14 and App Router
- **TypeScript**: Full type safety throughout the application
- **Authentication**: JWT-based authentication with protected routes
- **Admin Dashboard**: Full CRUD operations for projects and snippets

### Backend (API Routes)
- **MongoDB Integration**: Mongoose ODM for database operations
- **JWT Authentication**: Secure token-based authentication
- **File Uploads**: Cloudinary integration for image uploads
- **Rate Limiting**: Protection against abuse with express-rate-limit
- **Email Notifications**: Contact form with Nodemailer
- **RESTful API**: Clean, organized API endpoints

### Security
- **Rate Limiting**: Different limits for different endpoints
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Access and refresh token system
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Configured for production use

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Icons**: Additional icon library
- **Context API**: State management

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Cloudinary**: Image upload and management
- **Nodemailer**: Email functionality
- **express-rate-limit**: Rate limiting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shahan-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/shahan-portfolio

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Next.js
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret for JWT signing
- `JWT_REFRESH_SECRET`: A strong secret for refresh tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password

## 📁 Project Structure

```
shahan-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── contact/          # Contact page
│   │   ├── login/            # Login page
│   │   ├── project/          # Project page
│   │   ├── register/         # Register page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Footer.tsx        # Footer component
│   │   ├── Hero.tsx          # Hero section
│   │   └── HomePage.tsx      # Home page component
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   └── lib/                   # Utility libraries
│       ├── api.ts            # API client
│       ├── auth.ts           # JWT utilities
│       ├── cloudinary.ts     # Cloudinary config
│       ├── db.ts             # Database connection
│       └── email.ts          # Email utilities
├── models/                    # Mongoose models
│   ├── User.ts              # User model
│   ├── Project.ts           # Project model
│   ├── Snippet.ts           # Snippet model
│   └── Blog.ts              # Blog model
├── middleware.ts              # Next.js middleware
└── package.json              # Dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Projects
- `GET /api/project` - Get all projects
- `GET /api/project/[id]` - Get single project
- `POST /api/project` - Create project
- `PUT /api/project/[id]` - Update project
- `DELETE /api/project/[id]` - Delete project

### Contact
- `POST /api/contact` - Send contact form

### Images
- `POST /api/image/upload` - Upload image

### Snippets
- `GET /api/snippet` - Get all snippets
- `POST /api/snippet` - Create snippet
- `PUT /api/snippet/[id]` - Update snippet
- `DELETE /api/snippet/[id]` - Delete snippet

### Resume
- `GET /api/download-resume` - Download resume

## 🔒 Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Contact Form**: 3 submissions per hour
- **File Uploads**: 10 uploads per hour
- **Dashboard**: 50 requests per 15 minutes

### Authentication
- JWT access tokens (15 minutes)
- JWT refresh tokens (7 days)
- Password hashing with bcrypt
- Protected routes for admin functions

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for custom styles
- Update Tailwind config in `tailwind.config.js`
- Custom animations and shadows included

### Content
- Update personal information in components
- Modify contact details in Contact page
- Change social links in Header and Footer
- Update resume file in `public/resume/`

### Admin Access
- Update allowed emails in registration API
- Modify user roles in User model
- Customize dashboard features

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: shahan24h@gmail.com
- LinkedIn: [Shahan Ahmed](https://www.linkedin.com/in/shahan24h/)
- GitHub: [shahan24h](https://github.com/shahan24h)

---

Built with ❤️ by Shahan Ahmed
