import transform from '@svg2jsx/transform';
import { NextApiRequest, NextApiResponse } from 'next';

import httpStatusCode from '../../utils/httpStatusCode';
import path from 'path';

function toTitleCase(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase()).replace(/[-\s]/g, '');
}

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const svgFileContents: {
      fileName: string;
      fileContent: string;
    }[] = req.body.svgFileContents;
    console.log("🚀 ~ file: transform.ts:14 ~ svgFileContents:", svgFileContents)

    const jsxFileContents: {
      fileName: string;
      fileContent: string;
    }[] = []
    for (let i = 0; i < svgFileContents.length; i++) {
      const {
        fileName,
        fileContent
      } = svgFileContents[i];

      const jsx = await transform(fileContent, {
        cleanupIDs: true,
        jsxSingleQuote: true,
        memo: false,
        type: 'functional'
      });
      const baseNameWithoutExtension = path.basename(fileName, '.svg');
      const titleCaseFileName = toTitleCase(baseNameWithoutExtension);
      jsxFileContents.push({
        fileName: titleCaseFileName,
        fileContent: jsx
      });
    }
    console.log("🚀 ~ file: transform.ts:34 ~ jsxFileContents:", jsxFileContents)


    res.status(httpStatusCode.OK).send({ jsxFileContents });
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).send({ message: error.message });
  }
}
