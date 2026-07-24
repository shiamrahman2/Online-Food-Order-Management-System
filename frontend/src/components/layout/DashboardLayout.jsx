import Sidebar from './Sidebar.jsx'

export default function DashboardLayout({ title, links, children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cream">
      <Sidebar title={title} links={links} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">{children}</main>
    </div>
  )
}
