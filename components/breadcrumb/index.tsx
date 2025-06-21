import Link from "next/link";
import { Subtitle } from "../Subtitle";
import { Url } from "url";

export interface BreadCrumbProps {
  items: {
    label: React.ReactNode;
    url: string;
  }[];
}

export function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <div className="breadcrumbs p-0 w-full">
      <ul className="flex items-center justify-center sm:justify-start gap-y-3 w-full flex-wrap">
        {items.map((item, index) =>
          item.url === "" ? (
            <li key={index}>
              <Subtitle
                bold="normal"
                className="hover:font-semibold duration-300 cursor-default"
              >
                {item.label}
              </Subtitle>
            </li>
          ) : (
            <li key={index}>
              <Link href={item.url} className="hover:!no-underline">
                <Subtitle
                  bold="normal"
                  className="hover:font-semibold duration-300"
                >
                  {item.label}
                </Subtitle>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
