const todoForm = document.querySelector('#todo-form')
const editForm = document.querySelector('.edit-form')
const todoList = document.querySelector('#todo-list')
const todoInput = document.querySelector('#todo-input')
const editInput = document.querySelector('#edit-input')
const btnCancel = document.querySelector('#cancel-btn')
const searchInput = document.querySelector('#search-input')
const btnSearch = document.querySelector('#btn-search')
const selectInput = document.querySelector('#select-input')



let oldTitleTodo;

//Funções

const saveTodo = (todoText, done = 0, save = 1) => {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    const todo = document.createElement('h3');
    todo.innerText = todoText;

    todoDiv.appendChild(todo);
    
    //Lógica do botão check
    const btnCheck = document.createElement('button');
    btnCheck.classList.add('check-btn');
    //Mudando a estrutura html do botao com o icone do font
    btnCheck.innerHTML = '<i class="fa-solid fa-check"></i>'
    todoDiv.appendChild(btnCheck)

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('edit-btn');
    btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todoDiv.appendChild(btnEdit)

    const btnRemove = document.createElement('button');
    btnRemove.classList.add('remove-btn');
    btnRemove.innerHTML = ' <i class="fa-solid fa-xmark"></i>';
    todoDiv.appendChild(btnRemove)

    //Utilizando dados da LS
    if(done) {
        todoDiv.classList.add('done')
    }

    if(save) {
        saveTodoLocalStorage({todoText, done})
    }

    //Add a divTodo no todoList 
    todoList.appendChild(todoDiv);
}

const toggleForms = () => {
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
    editForm.classList.toggle('hide')
}

const editionTodo = (editTodo) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector('h3')

        if(todoTitle.innerText == oldTitleTodo) {
            todoTitle.innerText = editTodo

            updateEditLocalStorage(oldTitleTodo,editTodo)
        }
    })


}

const searchTodo = (search) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText.toLowerCase()

        const nomalizedSearch = search.toLowerCase()

        todo.style.display = 'flex'

        if(!todoTitle.includes(nomalizedSearch)) {
            todo.style.display = 'none'
        }

    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        if(filterValue == 'done') {
            todo.style.display = 'flex'
            if(!todo.classList.contains('done')) {
                todo.style.display = 'none'
            }
        }else if(filterValue == 'todo') {
            todo.style.display = 'flex'
            if(todo.classList.contains('done')) {
                todo.style.display = 'none'
            }
        }

        if(filterValue == 'all') {
            todo.style.display = 'flex'
        }

    })

}



//Eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const newTodo = todoInput.value

    if(newTodo) {
    saveTodo(newTodo)
    } else {
        alert('Escreva alguma tarefa')
    }

    todoInput.value = ''
    todoInput.focus()
    
})

/*Para Elementos que são colocados de forma dinâmica, é mais interessante chamar um evento na página toda 
e identificar qual o elemento a gente clicou*/

document.addEventListener('click', (e) => {
    const targetEl = e.target
    const dadElement = targetEl.closest('div') /* Closest serve para encontrar a div mais próxima do
    elemento em que a gente clicar*/

    let todoTitle

    if(dadElement && dadElement.querySelector('h3')) {
        todoTitle = dadElement.querySelector('h3').innerText
        console.log('O valor de todoTilte é =>',todoTitle)
    }
   

    if(targetEl.classList.contains('check-btn')) {
        dadElement.classList.toggle('done')

        updateTodoStatusLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains('remove-btn')) {
        dadElement.remove()
        removeTodoLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains('edit-btn')) {
        toggleForms()
        editInput.value = todoTitle
        oldTitleTodo = todoTitle
        console.log('oldTitleTodo é igual a:', oldTitleTodo)
    }
    
})


editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const editTodo = editInput.value
    console.log('a todo editada é igual a:', editTodo)
    editionTodo(editTodo)

    toggleForms()
})

btnCancel.addEventListener('click', (e) => {
    e.preventDefault()
    toggleForms()
})

searchInput.addEventListener('keyup', (e) => {

    const search = e.target.value
    searchTodo(search)
})

selectInput.addEventListener('change', (e) => {

    const filterValue = e.target.value
    filterTodos(filterValue)
})



btnSearch.addEventListener('click', (e) => {
    e.preventDefault()

    searchInput.value = ''


    searchInput.dispatchEvent(new Event('keyup'))
})

//LocalStorage

const getTodosLocalStorage = () => {
    // Todos os dados no localStorage são armazenados como strings, então usamos JSON.parse
    // para converter o conteúdo do localStorage de volta para um objeto ou um array vazio.
    // Se não houver dados no localStorage, retornamos um array vazio.
    const dataTodo = JSON.parse(localStorage.getItem('todos')) || []
    return dataTodo
} 

const loadTodos = () => {
    const todos = getTodosLocalStorage()

    todos.forEach((todo) => {
       saveTodo(todo.todoText, todo.done, 0)
    })

}

const saveTodoLocalStorage = (todo) => {
    // Obtemos a lista atual de todos do localStorage.
    const todos = getTodosLocalStorage()

    // Adicionamos o novo "todo" ao array existente.
    todos.push(todo)

    // Salvamos a lista atualizada de todos no localStorage.
    // Primeiro, convertemos o array de objetos em uma string com JSON.stringify.
    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodoLocalStorage = (todoTitle) => {
    const todos = getTodosLocalStorage()

    //O **todoTitle** sempre vai ter o valor do todo em que a gente clicar
    //Então o filter, ele pega apenas os todos que tem o nome diferente de todoTitle
    const todoFilter = todos.filter((todo) => todo.todoText !== todoTitle)

    //Com isso salvamos no localStorage, os todos que tiverem esse nome diferente
    //Excluindo o todo em que a gente clicar
    localStorage.setItem('todos', JSON.stringify(todoFilter))

}

const updateTodoStatusLocalStorage = (todoTitle) => {
    const todos = getTodosLocalStorage()

    // O map não retorna dados, ele modifica os dados originais
    todos.map((todo) =>  {
        if(todo.todoText === todoTitle) {
            todo.done = !todo.done
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos))
}

const updateEditLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    // O map não retorna dados, ele modifica os dados originais
    todos.map((todo) =>  {
        if(todo.todoText === todoOldText) {
            todo.todoText = todoNewText
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos))
}

loadTodos()


