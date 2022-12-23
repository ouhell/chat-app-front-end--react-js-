import { Document, Page } from "react-pdf";
import { useState } from "react";
import { useEffect } from "react";
import pdf from "../../../../shared/assets/pdf/chap4.pdf";
import axios from "axios";
const PDFReader = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  /*  useEffect(() => {
    axios
      .get(
        "https://firebasestorage.googleapis.com/v0/b/chatapp-717fc.appspot.com/o/files%2Fpdf%2FChapitre%204_Prolog%20Partie%201%2B%20Listes.pdf?alt=media&token=e000d2ad-fcea-4316-9012-173e9d34de72"
      )
      .then((res) => console.log("pdf axios res :", res.data))
      .catch((err) => console.log("pdf axios error :", err));
  }, []); */

  function onDocumentLoadSuccess({ numPages }) {
    console.log("pdf loaded");
    setNumPages(numPages);
  }
  console.log("pdf file", pdf);
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Document
        file="../../../../shared/assets/pdf/chap4.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PDFReader;
