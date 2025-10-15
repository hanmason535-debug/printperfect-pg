import { render, screen, fireEvent } from "@testing-library/react"
import Lightbox from "./Lightbox"
import { vi } from "vitest"

const items = [
  {_id:"1", title:"A", description:"da", image:{asset:{_ref:"image-a-2000x3000-jpg"}}} as any,
  {_id:"2", title:"B", description:"db", image:{asset:{_ref:"image-b-2000x3000-jpg"}}} as any
]

test("opens, shows title/desc, arrows navigate, esc closes", () => {
  const onOpenChange = vi.fn()
  render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

  expect(screen.getByRole("dialog", { name: "A" })).toBeInTheDocument()
  expect(screen.getByText("A")).toBeInTheDocument()

  // next
  const nextButtons = screen.getAllByLabelText(/next/i)
  fireEvent.click(nextButtons[nextButtons.length - 1])
  expect(screen.getByRole("dialog", { name: "B" })).toBeInTheDocument()
  expect(screen.getByText("B")).toBeInTheDocument()

  // prev
  const prevButtons = screen.getAllByLabelText(/previous/i)
  fireEvent.click(prevButtons[prevButtons.length - 1])
  expect(screen.getByRole("dialog", { name: "A" })).toBeInTheDocument()
  expect(screen.getByText("A")).toBeInTheDocument()

  // esc
  fireEvent.keyDown(window, { key: "Escape" })
  expect(onOpenChange).toHaveBeenCalledWith(false)
})
