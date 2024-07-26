"use client"

import { Button, Input } from "@/components/ui"
import type React from "react"
import { useState } from "react"

type SearchProps = {
  initialSearchParams: string
}

const Search: React.FC<SearchProps> = ({ initialSearchParams }) => {
  const [search, setSearch] = useState(initialSearchParams)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <form action="/" method="get">
      <Input
        placeholder="Search"
        name="search"
        value={search}
        onChange={handleChange}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}

export default Search
