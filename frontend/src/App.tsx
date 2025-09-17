import { type ReactNode, useState, type ChangeEvent } from 'react';
import FileUpload from './components/FileUpload';
import Textarea from './components/Textarea';
import { EmailContentResponse, UploadOption } from './types';
import Modal from './components/Modal';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const API_URL: string = import.meta.env.VITE_API_URL;

async function sendEmail(formData: FormData): Promise<EmailContentResponse> {
  const res = await fetch(`${API_URL}/process`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error sending email');
  }

  return res.json().then((res: object) =>
    Object.assign(
      new EmailContentResponse({
        category: 'Improdutivo',
        suggested_reply: '',
      }),
      res
    )
  );
}

const UploadEmailContent = () => {
  const [uploadOption, setUploadOption] = useState<UploadOption | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files.item(0));
    }

    setTextContent('');
  };

  const [textContent, setTextContent] = useState<string>('');
  const onTextContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
    setFile(null);
  };

  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const onSubmit = () => {
    const formData = new FormData();
    if (uploadOption === null) {
      setModalContent(<>Escolha uma opção antes de enviar.</>);
      return;
    }
    if (uploadOption == UploadOption.File) {
      if (file === null) {
        setModalContent(<>Faça upload de um arquivo antes de enviar!</>);
        return;
      }
      formData.append('file', file);
    } else {
      if (textContent === '') {
        setModalContent(<>Informe o conteúdo do e-mail antes de enviar!</>);
        return;
      }
      formData.append('text', textContent);
    }

    sendEmail(formData)
      .then((res) => {
        setModalContent(
          <div className="flex flex-col">
            <h1 className="self-center pb-4 text-xl font-bold text-gray-900">
              Resposta do E-mail Gerada
            </h1>
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold text-gray-800">Categoria:</p>
              <p className="font-bold text-gray-700">{res.category}</p>

              <p className="font-bold text-gray-800">Resposta sugerida:</p>
              <p className="font-bold text-gray-700">{res.suggested_reply}</p>
            </div>
          </div>
        );
      })
      .catch(() => {
        setModalContent(
          <>
            Ocorreu um erro ao gerar a resposta para o e-mail, tente novamente
            mais tarde ou contate o suporte.
          </>
        );
      });
  };

  const submitButton = (
    <button
      type="button"
      className="w-min self-center rounded-lg border border-gray-300 bg-gray-100 px-9 py-5 text-xl font-medium text-gray-700 hover:bg-gray-200 hover:text-blue-500"
      onMouseDown={onSubmit}
    >
      Enviar
    </button>
  );

  let innerDiv = null;
  if (uploadOption === null) {
    innerDiv = (
      <div className="max-w-xl p-2 text-center">
        Olá! Informe o conteúdo do e-mail através de arquivo pdf/txt, ou então
        colando o conteúdo do e-mail escolhendo uma das opções acima.
      </div>
    );
  } else if (uploadOption === UploadOption.File) {
    innerDiv = (
      <div className="flex h-full w-full flex-col gap-5">
        <FileUpload
          id="file-upload"
          accept=".txt,.pdf"
          file={file}
          onChange={onFileChange}
        />
        {submitButton}
      </div>
    );
  } else {
    innerDiv = (
      <div className="flex h-full w-full flex-col gap-5">
        <Textarea
          placeholder="Insira o conteúdo do email aqui..."
          value={textContent}
          onChange={onTextContentChange}
        />
        {submitButton}
      </div>
    );
  }

  return (
    <>
      <form className="flex w-xl flex-col rounded-lg">
        <div className="flex w-full rounded-md shadow-xs" role="group">
          <button
            type="button"
            className={`${uploadOption === UploadOption.File ? 'bg-gray-300 text-gray-900' : 'cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-blue-500'} w-full min-w-fit rounded-tl-lg border-y border-l border-gray-300 p-4 text-lg`}
            onMouseDown={() => {
              setUploadOption(UploadOption.File);
            }}
          >
            <i className="fa-solid fa-file-lines" />
            <span className="pl-2">Arquivo</span>
          </button>
          <button
            type="button"
            className={`${uploadOption === UploadOption.Text ? 'bg-gray-300 text-gray-900' : 'cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-blue-500'} w-full min-w-fit rounded-tr-lg border border-gray-300 p-4 text-lg`}
            onMouseDown={() => {
              setUploadOption(UploadOption.Text);
            }}
          >
            <i className="fa-solid fa-pencil" />
            <span className="pl-2">Texto</span>
          </button>
        </div>

        <div className="flex h-80 flex-col items-center justify-center rounded-b-lg border-x border-b border-gray-300 bg-white p-3">
          {innerDiv}
        </div>
      </form>

      <Modal
        isOpen={modalContent !== null}
        onClose={() => {
          setModalContent(null);
        }}
      >
        {modalContent}
      </Modal>
    </>
  );
};

const App = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-10">
        <h1 className="max-w-96 pb-4 text-center text-xl font-bold text-gray-800">
          Classificador e Gerador de Resposta Automática de E-mails
        </h1>

        <UploadEmailContent />
      </div>
    </div>
  );
};

export default App;
