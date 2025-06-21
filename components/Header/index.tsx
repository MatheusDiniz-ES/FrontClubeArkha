import React from "react";
import { ButtonProps } from "../Button";
import { Subtitle, SubtitleProps } from "../Subtitle";
import { Title, TitleProps } from "../Title";
import { BreadCrumb, BreadCrumbProps } from "../breadcrumb";
import { Buttons } from "./components/buttons";

interface HeaderProps {
    title: TitleProps;
    subtitle?: SubtitleProps;
    icon?: React.ReactNode;
    button?: ButtonProps;
    secondButton?: ButtonProps;
    customItem?: React.ReactNode;
    breadCrumbs?: BreadCrumbProps;
    upperTitle?: boolean;
}

export function Header(props: HeaderProps) {
    return (
        <>
            <div className="flex w-full gap-4 items-center justify-center flex-col md:justify-between md:flex-row">
                <div className="flex gap-4 flex-col sm:flex-row items-center text-gray-700 dark:text-gray-300">
                    {props.icon && <>{props.icon}</>}
                    <div className="flex flex-col items-center text-center md:text-left md:items-start">
                        {props.upperTitle && (
                            <Title
                                {...props.title}
                                className={`line-clamp-1 ${props.title.className} `}
                            />
                        )}
                        {props.breadCrumbs && (
                            <BreadCrumb {...props.breadCrumbs} />
                        )}
                        {props.subtitle && <Subtitle {...props.subtitle} />}
                        {!props.upperTitle && (
                            <Title
                                {...props.title}
                                className={`line-clamp-1 ${props.title.className} `}
                            />
                        )}
                    </div>
                </div>
                <Buttons
                    customItem={props.customItem}
                    button={props.button}
                    secondButton={props.secondButton}
                />
            </div>
        </>
    );
}
