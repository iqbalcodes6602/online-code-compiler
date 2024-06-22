export const CODE_SNIPPETS = {
    python: `def greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("world")\n`,
    csharp: 'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    java: `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    javascript: `function greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("world");\n`,
};


export const LANGUAGE_VERSIONS = {
    python: "3.10.0",
    csharp: "6.12.0",
    java: "15.0.2",
    javascript: "18.15.0",
};