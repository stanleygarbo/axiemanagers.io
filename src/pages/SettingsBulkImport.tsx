import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import styled, { css } from "styled-components";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { IScholars } from "../interfaces/IScholarsContext";
import { randomColor } from "../util/randomColor";

const scholarObjProperties = ["ronin", "color", "nickname", "managerShare"];
const externalListObjProperties = ["name", "eth", "managerShare"];

const SettingsBulkImport = () => {
  const { colors } = useTheme();
  const { scholars } = useScholars();

  const [scholarFileURL, setScholarFileURL] = useState<string>("");

  useEffect(() => {
    async function createBlob() {
      const json = JSON.stringify(scholars);
      const blob = new Blob([json], { type: "application/json" });
      const href = await URL.createObjectURL(blob);

      setScholarFileURL(href);
    }

    createBlob();
  }, [scholars]);

  const onDrop = async (selectedFile: File[]) => {
    var reader = new FileReader();
    reader.onload = async function (e) {
      var contents = e!.target!.result;
      // displayContents(contents);
      if (typeof contents === "string") {
        const json = JSON.parse(contents);
        const newListOfScholars: IScholars[] = [];
        if (json.length) {
          for (const i of json) {
            for (const key of Object.keys(i)) {
              if (scholarObjProperties.includes(key)) {
                console.log("included");
              } else {
                alert(
                  `JSON File structure is incompatible with axiemanagers.io, maybe this is from another tracker. \n\nLet me know what tracker you were previously using so that I can add that data structure to our system.`
                );
                return;
              }
            }
            // addScholar(i);
            if (scholars.find((obj) => obj.ronin === i.ronin)) {
              console.log("exists");
            } else {
              console.log("does not exists");
              newListOfScholars.push(i);
            }
            // await new Promise((resolve) => setTimeout(resolve, 3000));
          }
          localStorage.setItem(
            "scholars",
            JSON.stringify([...scholars, ...newListOfScholars])
          );
          // console.log([...scholars, ...newListOfScholars]);
        }
      }
    };
    reader.readAsText(selectedFile[0]);
  };

  const externalOnDrop1 = (selectedFile: File[]) => {
    var reader = new FileReader();
    reader.onload = async function (e) {
      var contents = e!.target!.result;
      // displayContents(contents);
      if (typeof contents === "string") {
        const json = JSON.parse(contents);
        const newListOfScholars: IScholars[] = [];
        if (json.length) {
          for (const i of json) {
            let included = 0;
            for (const key of Object.keys(i)) {
              if (externalListObjProperties.includes(key)) {
                included++;
                console.log("included");
              }
            }

            if (included === 3) {
              if (scholars.find((obj) => obj.ronin === i.eth)) {
                console.log("exists");
              } else {
                console.log("does not exists");
                const newObj = {
                  ronin: i.eth,
                  managerShare: i.managerShare,
                  nickname: i.name,
                  color: randomColor(),
                };

                newListOfScholars.push(newObj);
              }
            } else {
              alert(
                `JSON File structure is incompatible with axiemanagers.io, maybe this is from another tracker. \n\nLet me know what tracker you were previously using so that I can add that data structure to our system.`
              );
              return;
            }
            // await new Promise((resolve) => setTimeout(resolve, 3000));
          }
          localStorage.setItem(
            "scholars",
            JSON.stringify([...scholars, ...newListOfScholars])
          );
          // console.log([...scholars, ...newListOfScholars]);
        }
      }
    };
    reader.readAsText(selectedFile[0]);
  };

  return (
    <Container colors={colors}>
      <div className="wrapper">
        <div className="wrapper__title">
          You can only import/export your list of scholars that is in .json
          format. this will be useful when you clear your browser cache so that
          you don't have to re-enter everything all over again.
          <br />
          <br />
          Make sure to refresh after importing.
        </div>
        <div className="wrapper__buttons">
          <a href={scholarFileURL} download="list-of-scholars.json">
            Export
          </a>
          <Dropzone onDrop={onDrop} multiple={false} accept="application/json">
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Import</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        <br />
        Import .json file from other trackers
        <br />
        <br />
        <div className="wrapper__buttons">
          <Dropzone
            onDrop={externalOnDrop1}
            multiple={false}
            accept="application/json"
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Import from External Tracker</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    background-color: rgba(0, 0, 0, 0.07);
    padding: 15px;
    border-radius: 5px;
    flex: 1;
    margin: 0 20px;
    border: 1px solid ${colors.textIntense + 10};

    color: ${colors.textNotSoIntense};

    .wrapper {
      &__title {
        margin-bottom: 20px;
      }
      &__buttons {
        display: flex;
        a,
        section {
          cursor: pointer;
          color: #fff;
          background-color: ${colors.accent};
          padding: 5px 20px;
          border-radius: 4px;
          margin-right: 10px;
        }
      }
    }
  `}
`;

export default SettingsBulkImport;
