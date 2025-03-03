import { Link } from "react-router-dom";

const Breadcrumb = ({ links }) => {
    return (
        <nav className="text-gray-600 text-sm mb-6">
            {links.map((link, index) => (
                <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    {link.path ? (
                        <Link
                            to={link.path}
                            className="text-blue-600 hover:underline"
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900">{link.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
