import React from "react";
import { FaHome, FaUserFriends, FaChevronRight, FaPlusCircle } from "react-icons/fa";

/**
 * Props:
 * - items: Array of { label: string, href?: string, icon?: ReactNode }
 *   Example: [
 *     { label: "Customers", href: "/masters", icon: <FaUserFriends /> },
 *     { label: "Create Record", icon: <FaPlusCircle /> }
 *   ]
 */
const Breadcrumb = ({ items }) => {
  // Home is always first
  const home = { label: "Home", href: "/dashboard", icon: <FaHome className="text-blue-600 mr-1" /> };
  const allItems = [home, ...items];
  return (
    <nav aria-label="breadcrumb" className="flex flex-col justify-start items-start w-full mb-2">
      <ol className="flex items-center text-sm font-semibold  bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow px-4 py-2 border border-blue-200">
        {allItems.map((item, idx) => (
          <React.Fragment key={item.label}>
            <li className="flex items-center">
              {item.icon}
              {item.href ? (
                <a href={item.href} className="hover:underline text-blue-700">{item.label}</a>
              ) : (
                <span className={idx === allItems.length - 1 ? "text-green-700" : "text-blue-700"}>{item.label}</span>
              )}
            </li>
            {idx < allItems.length - 1 && (
              <FaChevronRight className="mx-2 text-blue-400" />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
