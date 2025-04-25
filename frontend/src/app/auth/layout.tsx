import Navbar from "@/components/utils/navbar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Navbar/>
            <div className="mt-6">{children}</div>
        </main>
    )
}