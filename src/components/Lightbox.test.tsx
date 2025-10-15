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

  // dialog is present
  expect(screen.getByRole("dialog")).toBeInTheDocument()
  expect(screen.getByTestId("lightbox-stage")).toBeInTheDocument()
  // heading shows current title (h3)
  expect(screen.getByRole("heading", { name: "A", level: 3 })).toBeInTheDocument()

  // next via data-testid
  fireEvent.click(screen.getByTestId("lightbox-next"))
  expect(screen.getByRole("dialog", { name: "B" })).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: "B", level: 3 })).toBeInTheDocument()

  // prev via data-testid
  fireEvent.click(screen.getByTestId("lightbox-prev"))
  expect(screen.getByRole("dialog", { name: "A" })).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: "A", level: 3 })).toBeInTheDocument()

  // esc
  fireEvent.keyDown(window, { key: "Escape" })
  expect(onOpenChange).toHaveBeenCalledWith(false)
})
