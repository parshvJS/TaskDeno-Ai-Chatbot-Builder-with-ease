// components/CodeSnippet.js
'use client'

import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy } from 'lucide-react';

const CodeSnippet = ({ language, codeString }: any) => {


    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(codeString);
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    };


    return (
        <div className="relative  text-white rounded-md p-4 my-4 w-full h-[250px]">
            <div className='w-full h-[40px] bg-yellow-200 rounded-t-md flex'>
                <button
                    onClick={handleCopy}
                    className="right-16 p-2 text-white rounded-md flex justify-end items-center transition-all"
                >
                    {
                        copied ?
                            <div className='flex gap-1'>
                                <Check width={20} height={20} color='#000' />
                                <p className='text-12 text-black'>Copied</p>
                            </div>
                            :
                            <div className='flex gap-1'>
                                <Copy width={16} height={16} color='#000' />
                                <p className='text-12 text-black'>Copy Snippt</p>
                            </div>
                    }
                </button>
            </div>

            <Highlight
                theme={themes.duotoneLight}
                code={codeString}
                language={language}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={`${className} p-4 rounded-md mb-10'`} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

export default CodeSnippet;
