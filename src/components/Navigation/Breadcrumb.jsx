import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import '../../styles/Breadcrumb.css'

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation()

  // Generate breadcrumb items if not provided
  const generateBreadcrumbs = () => {
    if (items.length > 0) return items

    const path = location.pathname
    const segments = path.split('/').filter(Boolean)

    const breadcrumbs = [{ label: 'Home', href: '/' }]

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={breadcrumb.href} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current">{breadcrumb.label}</span>
              ) : (
                <Link to={breadcrumb.href} className="breadcrumb-link">
                  {breadcrumb.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="breadcrumb-separator" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
