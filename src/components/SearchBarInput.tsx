import { Search } from "lucide-solid";
import type { Component, ComponentProps } from "solid-js";

type SearchBarInputProps = Omit<ComponentProps<"input">, "type" | "class">;
const SearchBarInput: Component<SearchBarInputProps> = (props) => {
    return (
        <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
                {...props}
            />
        </div>
    );
};

export default SearchBarInput;
