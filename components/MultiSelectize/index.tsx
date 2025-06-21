import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import { CardFlag } from "@/components/cardFlag";
import { ComboBox } from "@/components/comboBox";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

export interface Items {
	text?: string;
	value?: string;
}

interface SelectAccessControlsProps {
	allOptions: Items[];
	selectedOptions: Items[];
	setSelectedOptions: (e: Items[]) => void;

	active?: boolean;

	query?: string;
	setQuery?: Dispatch<SetStateAction<string>>;

	hiddenLabel?: boolean;
	label?: string;
	sublabel?: string;
    multiple?: boolean
}

export function MultiSelectize({
	active = false,
	...props
}: SelectAccessControlsProps) {
	return (
		<div className="flex flex-col gap-1 w-full">
			{!props.hiddenLabel && props.label && (
				<div className="flex flex-col gap-0">
					<Title bold="800">{props.label}</Title>
					<Subtitle size="xs">{props.sublabel}</Subtitle>
				</div>
			)}
			<div className="flex w-full flex-wrap flex-col xs:flex-row gap-4 text-medium border items-center border-gray-300 rounded py-2 px-4 dark:border-gray-600 bg-white shadow text-gray-700 dark:bg-gray-750 dark:text-gray-400 ">
				{props.selectedOptions.map((controls) => (
					<CardFlag
						text={controls.text}
						key={controls.value}
						active={active}
						removeClick={() =>
							props.setSelectedOptions(
								props.selectedOptions.filter((e) => e.value != controls.value),
							)
						}
					/>
				))}

				{props.selectedOptions.length == 0 && !active && (
					<div
						className={clsx(
							"flex items-center  justify-center rounded border py-3 px-4 gap-3 transition-all duration-300 text-sm font-medium w-full xs:w-fit bg-white dark:bg-gray-750 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600",
							{
								"cursor-pointer": active,
							},
						)}
					>
						Nenhuma opção selecionada
					</div>
				)}
				{active && (
					<ComboBox
                        // @ts-ignore
						values={
							props?.allOptions
								?.filter(
									(e) => !props.selectedOptions.some((i) => i.value == e.value),
								)
								?.map((e) => ({
									text: e.text,
									value: e.value,
								})) || []
						}
						query={props.query}
						setQuery={props.setQuery}
						placeholder="Selecione uma opção"
						active={active}
						selectValue={(e) => {

                            if(props.multiple){
                                props.setSelectedOptions([
                                    ...props.selectedOptions,
                                    {
                                        value: String(e.value),
                                        text: e.text,
                                    },
                                ])

                                return;
                            }

                            props.setSelectedOptions([
                                {
                                    value: String(e.value),
                                    text: e.text,
                                },
                            ])
                            

                            }
						}
					/>
				)}
			</div>
		</div>
	);
}
