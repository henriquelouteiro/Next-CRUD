import {Button,Flex,Text,VStack,Table,Thead,Tbody,Box,Tr,Th,Td} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

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

  const formik = useFormik({
    initialValues: {
      nome: "",
      email: ""
    },
    validationSchema: yup.object().shape({
      nome: yup.string("Necessario preencher o campo nome.").
        required("Necessario preencher o campo nome."),
      email: yup.string("Necessario preencher o campo email.").
        email("Email invalido.").
        required("Necessario preencher o campo email."),
      createdOn: yup.date().default(function () {
        return new Date();
      }),
    }),
    onSubmit: (values, {resetForm }) => {
      let {nome,email} = values;
      
      id ? handleSubmitUpdateCliente(nome,email) : handleSubmitCreateCliente(nome,email)
      resetForm();
  },
  });
  
  const resetFormikValues = () => {
    formik.resetForm({
      nome: "",
      email: ""
    });
  };

  const handleSubmitCreateCliente = async (name, email) => {

    try {
      setIsLoading(true);
      const response = await api.post("/clients", { name , email });

      setClients(
        clients.concat({
          _id: new Date().getMilliseconds().toString(),
          name,
          email,
        })
      );

      toggleFormState();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitUpdateCliente = async (name,email) => {

    try {
      setIsLoading(true);
      await api.put(`/clients/${id}`, { name, email });
      setClients(
        clients.map((client) =>
          client._id == id ? { name, email, _id: id } : client
        )
      );

      setId(null);
      toggleFormState();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowUpdateClienteForm = (client) => {
    setId(client._id);
    formik.setValues({nome: client.name,email: client.email}) 
    
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
          onSubmit={formik.handleSubmit}
                 >
          <InputForm
            name="nome"
            label="Nome"
            type="text"
            value={formik.values.nome}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nome && formik.errors.nome}
          />
          <InputForm
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
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
