import React, { useEffect, useState } from "react";
import { FormikField } from "./FormikField";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import Button from "../components/Button";
import { useScreenSize } from "../contexts/screenSizeContext";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";
import { fetchScholarByAddress } from "../api/requests";
import { Scholars } from "../interfaces/IResponseTypes";
import { useScholars } from "../contexts/scholarsContext";
import { randomColor } from "../util/randomColor";
import { withRouter } from "react-router-dom";
import SelectCategory from "./settings-category/SelectCategory";

const ScholarSchema = Yup.object().shape({
  ronin: Yup.string()
    .matches(/^ronin:[a-zA-Z0-9]{40}$/)
    .required("Required"),
  name: Yup.string().required("Required"),
  managerShare: Yup.number()
    .min(0, "Too low")
    .max(100, "Too high")
    .required("Required"),
});

const AddScholarForm = ({ history }) => {
  const { colors } = useTheme();
  const { screenWidth } = useScreenSize();
  const { addScholar, categories } = useScholars();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(()=>{
    if(categories.length > 0){
      setSelectedCategory(categories[0].name)
    }
  },[categories])

  const addRoninMutation = useMutation(
    (ronin: string) => fetchScholarByAddress(ronin),
    {
      onSuccess: async (variables) => {
        queryClient.setQueryData<Scholars>("Scholars", (old: any) => {
          old.list[variables.ronin] = variables;

          return old;
        });
      },
    }
  );

  const errorFieldStyle = {
    border: `1px solid ${colors.danger}`,
  };

  const inputFieldStyles = {
    border: `1px solid transparent`,
  };

  if (screenWidth > 767)
    return (
      <Container colors={colors}>
        <Formik
          validationSchema={ScholarSchema}
          initialValues={{
            name: "",
            ronin: "",
            managerShare: "",
          }}
          onSubmit={(values, { resetForm }) => {
            addScholar({
              nickname: values.name,
              ronin: values.ronin,
              managerShare: Number(values.managerShare),
              color: randomColor(),
              category: selectedCategory,
            });
            addRoninMutation.mutate(values.ronin.replace("ronin:", "0x"));
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <FormikField
                colors={colors}
                type="text"
                placeholder="Name"
                autoComplete="off"
                name="name"
                style={{
                  ...inputFieldStyles,
                  ...(errors.name && touched.name && errorFieldStyle),
                }}
              />
              <FormikField
                colors={colors}
                type="text"
                placeholder="Ronin Address"
                autoComplete="off"
                name="ronin"
                style={{
                  ...inputFieldStyles,
                  ...(errors.ronin && touched.ronin && errorFieldStyle),
                }}
              />
              <FormikField
                colors={colors}
                type="number"
                placeholder="Manager's Share"
                autoComplete="off"
                name="managerShare"
                style={{
                  ...inputFieldStyles,
                  ...(errors.managerShare &&
                    touched.managerShare &&
                    errorFieldStyle),
                }}
              />
              <section>
                <SelectCategory
                  size="medium"
                  onSelect={(category) => {
                    setSelectedCategory(category);
                  }}
                  currentCategory={selectedCategory}
                />
              </section>
              <Button
                foreground={colors.textIntense}
                type="submit"
                disabled={false}
                style={{
                  border: `1px solid ${colors.textIntense + 70}`,
                  background: "none",
                  whiteSpace: "nowrap",
                }}
              >
                ADD SCHOLAR
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    );

  return (
    <FloatingButton
      onClick={() => history.push("/add-scholar")}
      colors={colors}
    >
      <AiOutlineUsergroupAdd size={28} />
    </FloatingButton>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 100%;
    padding: 20px 20px 0 20px;

    form {
      max-width: 1160px;
      padding: 15px;

      border: 1px solid ${colors.textIntense + 20};
      border-radius: 5px;
      margin: 0 auto;
      background-color: ${colors.BGLight};

      display: grid;
      /* grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); */
      grid-template-columns:
        minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr)
        85px minmax(130px, 1fr);

      gap: 10px;

      section {
        .select-btn {
          width: 100%;
        }
      }
    }

    /* @media (max-width: 1023px) {
      form {
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      }
    } */
  `}
`;

const FloatingButton = styled.button<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 60px;
    height: 60px;
    border-radius: 100px;
    border: none;

    color: #fff;
    background-color: ${colors.accent};

    position: fixed;
    bottom: 20px;
    right: 20px;
    transition: 0.1s;
    z-index: 100;

    &:active {
      transform: scale(0.95);
    }

    @media (max-width: 493px) {
      bottom: 20px;
      right: 20px;
    }
  `}
`;

export default withRouter(AddScholarForm);
