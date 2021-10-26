import React, { useEffect, useState } from "react";
import { FormikField } from "../components/FormikField";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { randomColor } from "../util/randomColor";
import Button from "../components/Button";
import styled, { css } from "styled-components";
import { IoMdClose } from "react-icons/io";
import { IColors } from "../interfaces/IColors";
import { withRouter } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { fetchScholarByAddress } from "../api/requests";
import { Scholars } from "../interfaces/IResponseTypes";
import SelectCategory from "../components/settings-category/SelectCategory";

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
const AddScholar = ({ history }) => {
  const { addScholar } = useScholars();
  const { colors } = useTheme();
  const { categories } = useScholars();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0) setSelectedCategory(categories[0].name);
  }, [categories]);

  const errorFieldStyle = {
    border: `1px solid ${colors.danger}`,
  };

  const inputFieldStyles = {
    border: `1px solid ${colors.textIntense + 20}`,
  };

  const queryClient = useQueryClient();

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
          });
          addRoninMutation.mutate(values.ronin.replace("ronin:", "0x"));
          resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <section>
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
              {errors.ronin && touched.ronin ? (
                <div className="error">{errors.ronin}</div>
              ) : null}
            </section>
            <section>
              <SelectCategory
                currentCategory={selectedCategory}
                onSelect={(ctgry) => {
                  setSelectedCategory(ctgry);
                }}
                size="medium"
              />
            </section>
            <section>
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
              {errors.name && touched.name ? (
                <div className="error">{errors.name}</div>
              ) : null}
            </section>
            <section>
              <FormikField
                colors={colors}
                type="number"
                placeholder="Manager's %"
                autoComplete="off"
                name="managerShare"
                style={{
                  ...inputFieldStyles,
                  ...(errors.managerShare &&
                    touched.managerShare &&
                    errorFieldStyle),
                }}
              />
              {errors.managerShare && touched.managerShare ? (
                <div className="error">{errors.managerShare}</div>
              ) : null}
            </section>

            <div className="floating">
              <div className="floating__buttons">
                <button
                  type="button"
                  onClick={() => history.push("/")}
                  className="back"
                >
                  <IoMdClose size={25} />
                </button>

                <Button
                  foreground={"#ffffff"}
                  bgColor={colors.accent}
                  type="submit"
                  disabled={false}
                >
                  ADD SCHOLAR
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 500px;
    margin: 0px auto;
    height: calc(100vh - 88px);

    form {
      width: 100%;
      padding: 10px;

      display: grid;
      grid-template-columns: 1fr 100px 1fr 100px;
      gap: 10px;

      section {
        input {
          width: 100%;
          min-width: 100px;
          padding: 12px 20px;
        }

        .error {
          color: ${colors.danger};
        }
      }

      section:nth-child(1) {
        grid-column: span 3;
      }

      section:nth-child(2) {
        .select-btn {
          width: 100%;
          height: 45px;
        }
      }

      section:nth-child(3) {
        grid-column: span 2;
      }
      section:nth-child(4) {
        grid-column: span 2;
      }

      button {
        grid-column: span 2;
        border-radius: 100px;
        padding: 12px 40px;
      }

      .floating {
        width: 100%;
        padding: 20px;
        right: 0px;
        bottom: 0px;
        position: fixed;

        &__buttons {
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    .back {
      width: 50px;
      height: 50px;
      border-radius: 100px;
      border: 1px solid ${colors.textIntense + 20};
      padding: 0;

      display: grid;
      place-items: center;

      background-color: ${colors.textIntense + "10"};
      color: ${colors.textIntense};
    }
  `}
`;

export default withRouter(AddScholar);
