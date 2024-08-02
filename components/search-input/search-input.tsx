"use client"

import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDebouncedCallback } from "use-debounce"

interface SearchInputProps {
  initialSearchValue: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  initialSearchValue,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>(initialSearchValue || "")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClear = useCallback(() => {
    setSearch("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear()
      }
    }

    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyDown)
      return () => {
        inputElement.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [handleClear])

  const updateSearchParams = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }
      router.push(`?${params.toString()}`)
    },
    [searchParams, router],
  )

  const debouncedUpdateSearchParams = useDebouncedCallback((term: string) => {
    updateSearchParams(term)
  }, 500)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value // This is the term (current value of the search input)
    setSearch(term)
    debouncedUpdateSearchParams(term)
  }

  return (
    <div className="relative">
      <Input
        name={"search"}
        ref={inputRef}
        placeholder="Search..."
        value={search}
        onChange={handleChange}
        className="pr-10"
      />
      {search && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
