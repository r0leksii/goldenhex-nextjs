"use client"

import { Button, Input } from "@/components/ui"
import type React from "react"
import { useState } from "react"

type SearchProps = {
  initialSearchParams: string
}

export const SearchBar = ({ initialSearchParams }: SearchProps) => {
  const [search, setSearch] = useState(initialSearchParams)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <form>
      <div className={"flex flex-row items-center gap-2"}>
        <Input
          placeholder="Search"
          name="search"
          value={search}
          onChange={handleChange}
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}
