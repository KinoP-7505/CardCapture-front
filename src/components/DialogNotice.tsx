import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import type { ReactNode } from "react"

type PropsDialogConfirm = {
  open: boolean
  title: string
  children: ReactNode
  btnText: string
  // btnText2?: string
  onOpenChange: (open: boolean) => void
  onAnser: (anser: string) => void
}

/**
 * 通知ダイアログ
 * 操作を止めてユーザに確認を促す目的
 */
export const DialogNotice = ({
  open,
  title,
  btnText,
  children,
  onOpenChange,
  onAnser,
}: PropsDialogConfirm) => {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner alignItems="flex-start" pt="20">
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer>
              <Button variant="surface" width={"100px"} onClick={() => onAnser("1")}>
                {btnText}
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
