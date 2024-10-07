import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function ModalAlert(props: {
    isOpen: boolean,
    changeModal: (state: boolean) => void,
    text: string,
    description: string,
    action: () => Promise<void>  /* representa la acción a ejecutar*/
}) {
    return (
        <AlertDialog open={props.isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle> {props.text}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                        // se cierra el modal
                        props.changeModal(false)
                    }}  >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                        await props.action() // se ejecuta la acción si se brinda confirmación
                        // se cierra el modal
                        props.changeModal(false)
                    }} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
