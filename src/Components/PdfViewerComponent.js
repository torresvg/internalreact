import { useEffect, useRef } from "react";
import PSPDFKit from "pspdfkit";
import axios from 'axios';
import { baseUrl, autorizacionFiles, autorizacion } from '../Utils/ApiPDF';
export default function PdfViewerComponent(props) {
  console.log(props)
  const containerRef = useRef(null);
  const items = PSPDFKit.toolbarItems;
  useEffect(() => {
    const container = containerRef.current;
    const defaultItems = PSPDFKit.defaultToolbarItems;
    console.log(defaultItems);
    const items = PSPDFKit.defaultToolbarItems;
    let instance;
    const downloadButton = {
      type: "custom",
      id: "download-pdf",
      title: "Guardar",
      onPress: () => {
        instance.exportPDF().then((buffer) => {
          let fileName = props.name;
          const blob = new Blob([buffer], { type: "application/pdf" });
          var bodyFormData = new FormData();
          bodyFormData.append('files', blob, fileName);
          console.log(bodyFormData);
          axios.post(baseUrl + 'files/firmar', bodyFormData, autorizacionFiles).then(response => {
            console.log("Archivo Cargado")
            console.log(response);
            let url = baseUrl+'documento/firmado/'+props.id+'/'+response.data.message;
            axios.put(url, {a : "documento"}, autorizacion).then(response => {
              console.log("Archivo Cargado")
              console.log(response);
              location.reload();
            })
          }).catch(error => {
            console.log(error.message);
            console.log("Archivo no cargado")
          })
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          }
        });
      }
    };
    if (!props.estado) {
      items.length = items.length - 35;
      items.push(
        { type: 'signature' });
      items.push(downloadButton);
    } else {
      items.length = items.length - 35;
    }

    (async function () {
      await PSPDFKit.load({
        toolbarItems: items,
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      }).then((_instance) => {
        instance = _instance;
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  return <div ref={containerRef} style={{ width: "100%", height: "90vh" }} />;
}
