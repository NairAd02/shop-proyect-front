'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingBag, Settings, BarChart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'


export default function AdminOverviewPage() {
  const [isActive, setIsActive] = useState(false)
  // se protege la página
  useAuth(() => {
    setIsActive(true) // si se completó la verificación entonces se muesta la página
  })

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Manage user accounts, permissions, and access levels. View and edit user profiles, and handle user-related issues."
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Product Management",
      description: "Add, edit, and remove products from the store. Manage inventory, pricing, and product categories."
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Analytics and Reporting",
      description: "Access detailed reports on sales, user behavior, and inventory. Make data-driven decisions to improve your store."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Store Settings",
      description: "Configure store-wide settings, including payment methods, shipping options, and store policies."
    }
  ]

  return (
    <>
      {
        isActive ? <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6">Welcome to Your Admin Dashboard</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">About This Application</h2>
              <p className="text-gray-700">
                This web application is a comprehensive e-commerce platform designed to help you manage your online store efficiently.
                As an administrator or authorized worker, you have access to powerful tools and features that allow you to oversee
                all aspects of your online business, from user management to product inventory and sales analytics.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Admin Panel Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white shadow-lg rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <span className="mr-2 text-indigo-600">{feature.icon}</span>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-4">
                To begin managing your online store, use the navigation menu to access different sections of the admin panel.
                Each section provides specific tools and information related to its function.
              </p>
              <p className="text-gray-700">
                If you need any assistance or have questions about using the admin panel, please refer to the help documentation
                or contact our support team.
              </p>
            </div>
          </motion.div>
        </div> : 'loaging...'
      }
    </>
  )
}