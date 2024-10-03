type MainOption = {
  header: {
    label: string,
  }[]
};
export function TableElement(mainOption: MainOption, bodyList: { element: JSX.Element }[][]) {
  if (mainOption.header.length <= 0) {
    throw new Error(`カラムの数は1以上にして下さい`);
  }
  const headerElementList: JSX.Element[] = [];
  for (const h of mainOption.header) {
    const index = mainOption.header.indexOf(h);
    headerElementList.push(
      <th scope="col" className="px-6 py-4 text-left whitespace-nowrap" key={`th-${index}`}>{h.label}</th>
    );
  }
  const bodyElementList: JSX.Element[] = [];
  let trIndex = 0;
  for (const body of bodyList) {
    const tdElementList: JSX.Element[] = [];
    for (let i = 0; i < mainOption.header.length; i++) {
      const tdBody: { element: JSX.Element } = body[i];
      tdElementList.push(<td className="px-1 py-1" key={`td-${i}`}>{tdBody.element}</td>);
    }
    bodyElementList.push(
      <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-sm text-gray-900 font-light" key={`tr-${trIndex}`}>
        {tdElementList}
      </tr>
    );
    trIndex += 1;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white border-b sticky top-0 text-md font-medium text-gray-900">
          <tr>
            {headerElementList}
          </tr>
        </thead>
        <tbody className="">
          {bodyElementList}
        </tbody>
      </table>
    </div>
  );
}
