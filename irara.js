// um framework do framework do framework
var fs = require('fs');

// vars
var dolar = "$"
var crase = "`"

// node irara.js new mcv

// FOLDERS
function folders(){
    if (!fs.existsSync(`./controllers`)){
        console.log('[  OK  ] - CREATE CONTROLLER');
    
        fs.mkdirSync(`./controllers`);                
    }
    if (!fs.existsSync(`./models`)){
        console.log('[  OK  ] - CREATE MODELS');
    
        fs.mkdirSync(`./models`);                
    }
    if (!fs.existsSync(`./data`)){
        console.log('[  OK  ] - CREATE DATA');
    
        fs.mkdirSync(`./data`);                
    }
    if (!fs.existsSync(`./components`)){
        console.log('[  OK  ] - CREATE COMPONENTS');
    
        fs.mkdirSync(`./components`);                
    }
    if (!fs.existsSync(`./pages`)){
        console.log('[  OK  ] - CREATE PAGES');
    
        fs.mkdirSync(`./pages`);                
    }
    if (!fs.existsSync(`./data`)){
        console.log('[  OK  ] - CREATE DATA');
    
        fs.mkdirSync(`./data`);                
    }
    if (!fs.existsSync(`./pages/api`)){
        console.log('[  OK  ] - CREATE API FOLDER');
    
        fs.mkdirSync(`./pages/api`);                
    }
}

//INDEX'S
function indexs(){
    if (!fs.existsSync(`./controllers/index.js`)){
        fs.writeFile(`./controllers/index.js`, "//IMPORTE OS CONTROLLER", function (err) {
            if (err) throw err;
            console.log('[  OK  ] - INDEX CREATE');
        });
    }    

    if (!fs.existsSync(`./config.js`)){
        fs.writeFile(`./config.js`, `//CONFIG
const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api' // development api
    : 'http://localhost:3000/api'; // production api

export {
    apiUrl
};`, function (err) {
            if (err) throw err;
            console.log('[  OK  ] - CONFIG CREATE');
        });
    }   

    if (!fs.existsSync(`./models/index.js`)){
        fs.writeFile(`./models/index.js`, "//IMPORTE OS CONTROLLER\nexport * from './fetch-wrapper';", function (err) {
            if (err) throw err;
            console.log('[  OK  ] - INDEX CREATE');
        });
    }    

    if (!fs.existsSync(`./models/fetch-wrapper.js`)){
        fs.writeFile(`./models/fetch-wrapper.js`, `export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET'
    };
    
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function _delete(url) {
    const requestOptions = {
        method: 'DELETE'
    };
    return fetch(url, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}`, function (err) {
            if (err) throw err;
            console.log('[  OK  ] - fetch-wrapper CREATE');
        });
    }   

}

function createModel(name){
    fields = []
    // Carrega os parametros
    for(var i=0;i<process.argv.length;i++){ 
        if (i > 3)   {
            //console.log(process.argv[i])
            fields.push(process.argv[i])
        }    
    }    

    model_script = ` // model ${name}
const fs = require('fs');

let ${name}s = require('data/${name}s.json');

export const ${name}sRepo = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return ${name}s;
}

function getById(id) {
    return ${name}s.find(x => x.id.toString() === id.toString());
}

function create({ ${fields.map(x=>`${x}`)} }) {
    const ${name} = { ${fields.map(x=>`${x}`)} };

    // validates

    // generate new ${name} id
    ${name}.id = ${name}s.length ? Math.max(...${name}s.map(x => x.id)) + 1 : 1;

    // set date created and updated
    ${name}.dateCreated = new Date().toISOString();
    ${name}.dateUpdated = new Date().toISOString();

    // add and save ${name}
    ${name}s.push(${name});
    saveData();
}

function update(id, { ${fields.map(x=>`${x}`)} }) {
    const params = { ${fields.map(x=>`${x}`)} };
    const ${name} = ${name}s.find(x => x.id.toString() === id.toString());

    // validate

    // set date updated
    ${name}.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(${name}, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted ${name} and save
    ${name}s = ${name}s.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/${name}s.json', JSON.stringify(${name}s, null, 4));
}
    `

    if (!fs.existsSync(`./models/${name}.model.js`)){
        fs.writeFile(`./models/${name}.model.js`, model_script, function (err) {
            if (err) throw err;
            console.log(`[  OK  ] - CREATE MODEL AND DATA ${name}`);
        });

        fs.readFile(`./models/index.js`, (err, data) => {
            if (err) throw err;
            console.log(data);

            fs.writeFile(`./models/index.js`, `${data}\nexport * from './${name}.model';`, function (err) {
                if (err) throw err;
                console.log(`[  OK  ] - ADD ${name} TO INDEX.JS `);
            });
        });        
    }

    if (!fs.existsSync(`./data/${name}s.json`)){
        fs.writeFile(`./data/${name}s.json`, `[
    {
        "id": 0
    }
]`, function (err) {
            if (err) throw err;
            console.log(`[  OK  ] - CREATE DATA ${name}`);
        });        
    }

    var controller_script = ` //CONTROLLER
import { apiUrl } from 'config';
import { fetchWrapper } from 'models';

export const ${name}Controller = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

const baseUrl = ${crase}${dolar}{apiUrl}/${name}s${crase};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(${crase}${dolar}{baseUrl}/${dolar}{id}${crase});
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(${crase}${dolar}{baseUrl}/${dolar}{id}${crase}, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(${crase}${dolar}{baseUrl}/${dolar}{id}${crase});
}
`
if (!fs.existsSync(`./controllers/${name}.controller.js`)){
    fs.writeFile(`./controllers/${name}.controller.js`, controller_script, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE CONTROLLER ${name}`);
    });        
}

fs.readFile(`./controllers/index.js`, (err, data) => {
    if (err) throw err;
    console.log(data);

    fs.writeFile(`./controllers/index.js`, `${data}\nexport * from './${name}.controller';`, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - ADD ${name} TO INDEX.JS `);
    });
});

var api_index_script = `// API ${name}
import { ${name}sRepo } from 'models';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return get${name}s();
        case 'POST':
            return create${name}();
        default:
            return res.status(405).end(${crase}Method ${dolar}{req.method} Not Allowed${crase})
    }

    function get${name}s() {
        const ${name}s = ${name}sRepo.getAll();
        return res.status(200).json(${name}s);
    }
    
    function create${name}() {
        try {
            ${name}sRepo.create(req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }
}
`
if (!fs.existsSync(`./pages/api/${name}s`)){
    console.log(`[  OK  ] - CREATE API FOLDER ${name}`);

    fs.mkdirSync(`./pages/api/${name}s`);                
}

if (!fs.existsSync(`./pages/api/${name}s/index.js`)){
    fs.writeFile(`./pages/api/${name}s/index.js`, api_index_script, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE API ${name}`);
    });        
}

var api_id_script = ` // API ID ${name}
import { ${name}sRepo } from 'models';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return get${name}ById();
        case 'PUT':
            return update${name}();
        case 'DELETE':
            return delete${name}();
        default:
            return res.status(405).end(${crase}Method ${dolar}{req.method} Not Allowed${crase})
    }

    function get${name}ById() {
        const ${name} = ${name}sRepo.getById(req.query.id);
        return res.status(200).json(${name});
    }

    function update${name}() {
        try {
            ${name}sRepo.update(req.query.id, req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }

    function delete${name}() {
        ${name}sRepo.delete(req.query.id);
        return res.status(200).json({});
    }
}
`

if (!fs.existsSync(`./pages/api/${name}s/[id].js`)){
    fs.writeFile(`./pages/api/${name}s/[id].js`, api_id_script, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE API ${name}`);
    });        
}

// FINALMENTE AS VIEWS
if (!fs.existsSync(`./components/${name}s`)){
    console.log(`[  OK  ] - CREATE components FOLDER ${name}`);

    fs.mkdirSync(`./components/${name}s`);                
}

if (!fs.existsSync(`./components/${name}s/index.js`)){
    fs.writeFile(`./components/${name}s/index.js`, "export * from './AddEdit';", function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE INDEX COMPONENTE ${name}`);
    });
}

var add_edit_view = `import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { ${name}Controller, alertService } from 'controllers';

export { AddEdit };

function AddEdit(props) {
    const ${name} = props?.${name};
    const isAddMode = !${name};
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        ${fields.map(x=>`${x}: Yup.string().required('${x} is required')`)}
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        const {...defaultValues } = ${name};
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(${name}.id, data);
    }

    function createUser(data) {
        return ${name}Controller.create(data)
            .then(() => {
                alertService.success('${name} adicionado', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return ${name}Controller.update(id, data)
            .then(() => {
                alertService.success('${name} Atualizado', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isAddMode ? 'Add ${name}' : 'Edit ${name}'}</h1>
            <div className="form-row">  
                ${(fields.map(x=>` 
                <div className="form-group col-3">
                    <label>${x}</label>
                    <input name="${x}" type="text" {...register('${x}')} className={${crase}form-control ${dolar}{errors.${x} ? 'is-invalid' : ''}${crase}} />
                    <div className="invalid-feedback">{errors.${x}?.message}</div>
                </div>`)).toString().replace(',','')}
            </div>            
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Salvar
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Limpar Form</button>
                <Link href="/${name}s" className="btn btn-link">Voltar</Link>
            </div>
        </form>
    );
}`

if (!fs.existsSync(`./components/${name}s/AddEdit.jsx`)){
    fs.writeFile(`./components/${name}s/AddEdit.jsx`, add_edit_view, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE INDEX COMPONENTE ${name}`);
    });
}

if (!fs.existsSync(`./pages/${name}s`)){
    console.log(`[  OK  ] - CREATE pages FOLDER ${name}`);

    fs.mkdirSync(`./pages/${name}s`);                
}

if (!fs.existsSync(`./pages/${name}s/edit`)){
    console.log(`[  OK  ] - CREATE pages/edit FOLDER ${name}`);

    fs.mkdirSync(`./pages/${name}s/edit`);                
}

var page_index_script = `
import { useState, useEffect } from 'react';

import { Link } from 'components';
import { ${name}Controller } from 'controllers';

export default Index;

function Index() {
    const [${name}s, set${name}s] = useState(null);

    useEffect(() => {
        ${name}Controller.getAll().then(x => set${name}s(x));
    }, []);

    function delete${name}(id) {
        set${name}s(${name}s.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        ${name}Controller.delete(id).then(() => {
            set${name}s(${name}s => ${name}s.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>${name}s</h1>
            <Link href="/${name}s/add" className="btn btn-sm btn-success mb-2">Add ${name}</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
       ${(fields.map(x=>`<th style={{ width: '30%' }}>${x}</th>`)).toString().replace(',','')}
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {${name}s && ${name}s.map(${name} =>
                        <tr key={${name}.id}>
           ${(fields.map(x=>`<td>{${name}.${x}}</td>`)).toString().replace(',','')}
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={${crase}/${name}s/edit/${dolar}{${name}.id}${crase}} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => delete${name}(${name}.id)} className="btn btn-sm btn-danger btn-delete-${name}" disabled={${name}.isDeleting}>
                                    {${name}.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!${name}s &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {${name}s && !${name}s.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No ${name}s To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

`

if (!fs.existsSync(`./pages/${name}s/index.jsx`)){
    fs.writeFile(`./pages/${name}s/index.jsx`, page_index_script, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE INDEX COMPONENTE ${name}`);
    });
}

if (!fs.existsSync(`./pages/${name}s/add.jsx`)){
    fs.writeFile(`./pages/${name}s/add.jsx`, `import { AddEdit } from 'components/${name}s'; \nexport default AddEdit;`, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE INDEX COMPONENTE ${name}`);
    });
}
var page_edit_id_script = `
import { AddEdit } from 'components/${name}s';
import { ${name}Controller } from 'controllers';

export default AddEdit;

export async function getServerSideProps({ params }) {
    const ${name} = await ${name}Controller.getById(params.id);

    return {
        props: { ${name} }
    }
}
`

if (!fs.existsSync(`./pages/${name}s/edit/[id].jsx`)){
    fs.writeFile(`./pages/${name}s/edit/[id].jsx`, page_edit_id_script, function (err) {
        if (err) throw err;
        console.log(`[  OK  ] - CREATE INDEX COMPONENTE ${name}`);
    });
}



}


// AÇÕES
if (process.argv[2] == "new"){
    console.log("WELCOME TO IRARA, THE FRAMEWORK OF THE FRAMEWORK OF THE FRAMEWORK ");
    console.log("# CREATE FOLDERS AND INDEX'S");    
    // CRIAR FOLDERS
    folders()
    indexs()
    // CRIAR INDEX.JS
} else if (process.argv[2] == "scaffold") {
    console.log(`CREATING SCAFFOLD ${process.argv[3]}`);

    // MODEL
    createModel(process.argv[3])
    
}
