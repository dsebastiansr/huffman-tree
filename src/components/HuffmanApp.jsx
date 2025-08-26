import { useEffect, useRef, useState } from 'react';

function getHuffmanTable(text) {
  if (!text) return { table: [], tree: null };

  const freq = {};

  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let nodes = Object.entries(freq).map(([character, frequency]) => ({
    character,
    frequency,
  }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.frequency - b.frequency);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({
      character: '',
      frequency: left.frequency + right.frequency,
      left,
      right,
    });
  }

  const codes = {};

  function assignCodes(node, prefix = '') {
    if (!node) return;
    if (node.character) codes[node.character] = prefix;
    if (node.right) assignCodes(node.right, prefix + '0');
    if (node.left) assignCodes(node.left, prefix + '1');
  }

  if (nodes[0]) assignCodes(nodes[0]);

  const table = Object.keys(freq).map((character) => ({
    character,
    frequency: freq[character],
    code: codes[character] || '',
  }));

  return { table, tree: nodes[0] };
}

export default function HuffmanApp() {
  const [texto, setTexto] = useState('');
  const { table: tabla, tree: arbol } = getHuffmanTable(texto);
  const codificado =
    tabla.length > 0
      ? texto
          .split('')
          .map((char) => {
            const row = tabla.find((r) => r.character === char);
            return row ? row.code + ' ' : '';
          })
          .join('')
      : '';
  const graphRef = useRef(null);

  useEffect(() => {
    if (window.drawHuffmanTree && graphRef.current) {
      window.drawHuffmanTree(arbol);
    }
  }, [arbol, texto]);

  return (
    <div className="w-full">
      <img
        src="https://dsebastiansr.github.io/huffman-tree/nordic.jpg"
        className="z-[-99] fixed brightness-50 w-full h-full object-cover"
        alt=""
      />
      <div className=" flex flex-col max-lg:items-center p-6 max-lg:py-8 h-auto gap-8 w-full">
        <h1 className="text-center h-20 flex items-center text-5xl font-bold">
          Codificación Huffman
        </h1>

        <div className="flex gap-10 w-full max-lg:flex-col">
          <div className="h-fit flex flex-col gap-6 w-[40%] max-lg:w-full ">
            <div className="flex flex-col gap-3 rounded-xl shadow-lg px-6 py-6 bg-slate-500/5 bg-clip-padding backdrop-filter backdrop-blur backdrop-saturate-50 backdrop-contrast-100">
              <h2 className="text-2xl font-bold">Entrada</h2>
              <input
                className="text-xl px-3 py-2 outline rounded-lg outline-[#555] focus:outline-[#b5b5b5] transition-all"
                type="text"
                name="texto"
                placeholder="Ingresa el texto..."
                autoComplete="off"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <input/>
            </div>

            <div className="flex flex-col shadow-lg rounded-xl px-6 py-6 bg-slate-500/5 bg-clip-padding backdrop-filter backdrop-blur backdrop-saturate-50 backdrop-contrast-100 field-sizing-content">
              <h2 className="text-2xl font-bold">Codificación</h2>
              <div
                id="tabla-huffman"
                className="transition-all duration-300 ease-in-out flex flex-col gap-6 mt-2 overflow-y-auto"
                style={{
                  maxHeight: tabla.length ? '500px' : '0',
                  opacity: tabla.length ? 1 : 0,
                }}
              >
                <table className="w-full text-lg text-left px-3">
                  <thead>
                    <tr className="text-gray-200 animate__animated animate__fadeIn">
                      <th>Caracter</th>
                      <th>Frecuencia</th>
                      <th>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabla.map((row) => (
                      <tr
                        key={row.character}
                        className="animate__animated animate__fadeIn"
                      >
                        <td>{row.character}</td>
                        <td>{row.frequency}</td>
                        <td>{row.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  id="codificado"
                  className="text-md px-3 py-3 border rounded-lg border-[#555] transition-all font-mono text-gray-100 animate__animated animate__fadeIn"
                >
                  {codificado}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3 shadow-md rounded-xl px-6 py-6 bg-slate-500/5 bg-clip-padding backdrop-filter backdrop-blur backdrop-saturate-50 backdrop-contrast-100">
            <h2 className="text-2xl font-bold">Gráfico</h2>
            <div className="graph h-full" ref={graphRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
