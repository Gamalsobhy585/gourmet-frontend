import { cn } from "../lib/utils";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Layout() {
  

  const { t, i18n } = useTranslation();

  const navItems = [
    {
      title: t("product.title"),
      url: "/",
    },
  
  ];

 



  return (
    <div
      className="p-4 grid grid-cols-5 xl:grid-cols-6 h-screen bg-[#f7f7f7] overflow-hidden"
      dir={i18n.language == "ar" ? "rtl" : "ltr"}
    >
      <aside className="hidden lg:flex flex-col col-span-1 border rounded-2xl py-4 bg-background">
        <div>
          <header className="flex justify-center items-center pb-4 mx-4 border-b">
            <Link to="/">
              <img src="/dark-logo.png" alt="logo" width={150} />
            </Link>
          </header>
          <div className="pt-4">
          <ul className="flex flex-col gap-4 p-0">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.url}
                  className={cn(
                    "text-lg text-gray-500 block w-full px-4 hover:text-primary font-medium",
                    {
                      "text-primary": true,
                      [i18n.language === "ar" ? "border-r-4" : "border-l-4"]: true,
                      "border-primary hover:border-primary/50 hover:text-primary/50": true
                    }
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </aside>
      
      <main className="flex flex-col col-span-5 lg:col-span-4 xl:col-span-5 px-4 gap-4 overflow-y-scroll">
       
        <Outlet />
      </main>
    </div>
  );
}