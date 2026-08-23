import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import type { ReactNode } from "react"

type PropsDialogConfirm = {
  open: boolean
  title: string
  children: ReactNode
  // btnText1: string
  // btnText2?: string
  onOpenChange: (open: boolean) => void
  onAnser: (anser: string) => void
}

export const DialogConfirm = ({
  open,
  title,
  children,
  onOpenChange,
  onAnser,
}: PropsDialogConfirm) => {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={() => onAnser("1")}>
                {/* {props.btnText1} */}
                ボタン１
              </Button>
              <Button
                colorPalette="blue"
                onClick={() => {
                  onAnser("2")
                  onOpenChange(false)
                }}
              >
                {/* {btnText2} */}
                ボタン２
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" pos="absolute" top="2" right="2" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
