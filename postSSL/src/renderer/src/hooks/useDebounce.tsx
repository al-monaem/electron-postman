import { useEffect, useState } from 'react'

const useDebounce = (value: any, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeouteId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeouteId)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
