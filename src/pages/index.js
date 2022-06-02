import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Text,
  FormControl,
  Input,
  FormLabel,
  VStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Box,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { InputForm } from "../components/Input";
import api from "../services/api";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);

  const [erros, setErros] = useState({ name: null, email: null });

  const isValidFormData = () => {
    if (!name) {
      setErros({ name: "Nome é requirido" });
      return false;
    }
    if (!email) {
      setErros({ email: "Email é requirido" });
      return false;
    }

    if (clients.some((client) => client.email == email && client._id !== id)) {
      setErros({ email: "Email já é utilizado" });
      return false;
    }

    setErros({});
    return true;
  };

  const handleSubmitCreateCliente = async (e) => {
    e.preventDefault();

    if (!isValidFormData()) return;

    try {
      setIsLoading(true);
      const response = await api.post("/clients", { name, email });

      setClients(
        clients.concat({
          _id: new Date().getMilliseconds().toString(),
          name,
          email,
        })
      );
      setName("");
      setEmail("");
      toggleFormState();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitUpdateCliente = async (e) => {
    e.preventDefault();

    if (!isValidFormData()) return;

    try {
      setIsLoading(true);
      await api.put(`/clients/${id}`, { name, email });
      setClients(
        clients.map((client) =>
          client._id == id ? { name, email, _id: id } : client
        )
      );

      setId(null);
      setName("");
      setEmail("");
      toggleFormState();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowUpdateClienteForm = (client) => {
    setId(client._id);
    setName(client.name);
    setEmail(client.email);
    setIsFormOpen(true);
  };
  const handleDeleteCliente = async (_id) => {
    try {
      setIsLoading(true);
      await api.delete(`/clients/${_id}`);
      setClients(clients.filter((client) => client._id !== _id));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeName = (text) => {
    setName(text);
  };

  const handleChangeEmail = (text) => {
    setEmail(text);
  };

  const toggleFormState = () => {
    setIsFormOpen(!isFormOpen);
  };

  useEffect(() => {
    api.get("/clients").then(({ data }) => {
      setClients(data.data);
    });
  }, []);

  return (
    <Box margin="1rem">
      <Flex color="white" justifyContent="space-between" margin="4">
        <Text color="black" fontSize="2xl">
          Lista de Clientes
        </Text>
        <Button colorScheme="blue" onClick={toggleFormState}>
          {isFormOpen ? "-" : "+"}
        </Button>
      </Flex>

      {isFormOpen && (
        <VStack
          margin="1rem"
          as="form"
          onSubmit={id ? handleSubmitUpdateCliente : handleSubmitCreateCliente}
        >
          <InputForm
            name="nome"
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => handleChangeName(e.target.value)}
            error={erros.name}
          />
          <InputForm
            name="email"
            label="Email"
            type="email"
            error={erros.email}
            value={email}
            onChange={(e) => handleChangeEmail(e.target.value)}
          />

          <Button
            fontSize="sm"
            alignSelf="flex-end"
            colorScheme="blue"
            type="submit"
          >
            {id ? "Atualizar" : "Cadastrar"}
          </Button>
        </VStack>
      )}

      <Table variant="simple" my="10">
        <Thead bgColor="blue.400">
          <Tr>
            <Th color="white">Name</Th>
            <Th color="white">Email</Th>
            <Th color="white">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clients.map((client) => (
            <Tr key={client._id}>
              <Td>{client.name}</Td>
              <Td>{client.email}</Td>
              <Td>
                <Flex justifyContent="space-between">
                  <Button
                    size="sm"
                    fontSize="smaller"
                    colorScheme="yellow"
                    mr="2"
                    onClick={() => handleShowUpdateClienteForm(client)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    fontSize="smaller"
                    colorScheme="red"
                    onClick={() => handleDeleteCliente(client._id)}
                  >
                    Deletar
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
