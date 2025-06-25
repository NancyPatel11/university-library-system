import React, { useState } from "react";

export const SearchBar = ({ onSearch }) => {
	const [searchValue, setSearchValue] = useState("");

	const handleChange = (e) => {
		const value = e.target.value;
		setSearchValue(value);
		onSearch?.(value);
	};

	return (
		<div>
			<form
				className="ibm-plex-sans-300 w-[400px]"
				onSubmit={(e) => e.preventDefault()} 
			>
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg
							className="w-4 h-4 text-admin-primary-blue"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						type="search"
						value={searchValue}
						onChange={handleChange}
						className="block w-full p-3 ps-10 text-sm border border-admin-dark-border rounded-sm bg-white 
                       text-admin-secondary-black focus:outline-none caret-admin-primary-blue"
						placeholder="Search borrow requests, books by title, author, genre."
					/>
				</div>
			</form>
		</div>
	);
};