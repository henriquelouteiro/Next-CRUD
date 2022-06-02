import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"

export const InputForm = ({ label, name, error = null, ...rest }) => {
    return (
        <FormControl marginY="1rem" isInvalid={!!error}>
            <FormLabel htmlFor={name} >{label}</FormLabel>
            <Input id={name} {...rest} />

            {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
}
