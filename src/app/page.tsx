"use client";

import { Combobox } from "@/ui/combobox";
import { useState } from "react";

type Option = {
  name: string;
  sex: "male" | "female";
  age: number;
};

const options: Option[] = [
  {
    name: "John Doe",
    sex: "male",
    age: 30,
  },
  {
    name: "Jane Doe",
    sex: "female",
    age: 25,
  },
  {
    name: "Bob Smith",
    sex: "male",
    age: 40,
  },
  {
    name: "Alice Smith",
    sex: "female",
    age: 35,
  },
];

export default function Home() {
  const [value, setValue] = useState<Option | null>(null);
  return (
    <div className="p-4">
      <Combobox
        options={options}
        value={value}
        onChange={(v) => v && setValue(v)}
        searchBy="name"
        render={({ age, name, sex }) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{age}</span>
              <span>{name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{sex}</span>
          </div>
        )}
        renderSelected={"name"}
      />
    </div>
  );
}
