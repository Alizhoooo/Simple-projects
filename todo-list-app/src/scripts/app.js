    // Получаем ссылки на HTML-элементы
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Функция для добавления новой задачи
    function addTask() {
        const taskText = taskInput.value.trim(); // Получаем текст задачи и удаляем пробелы по краям

        if (taskText === '') {
            // Если поле пустое, можно вывести сообщение или просто ничего не делать
            console.log('Please enter a task..');
            return; // Выходим из функции, если текст пуст
        }

        // 1. Создаем новый элемент списка (<li>)
        const listItem = document.createElement('li');
        listItem.classList.add('task-item'); // Добавляем класс для стилизации

        // 2. Добавляем текст задачи в <li>
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        listItem.appendChild(taskSpan);

        // 3. Создаем кнопку "Удалить"
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn'); // Добавляем класс для стилизации

        // 4. Добавляем обработчик события для кнопки "Удалить"
        deleteBtn.addEventListener('click', function() {
            taskList.removeChild(listItem); // Удаляем li-элемент из списка
        });

        // 5. Добавляем обработчик события для переключения класса 'completed'
        taskSpan.addEventListener('click', function() {
            listItem.classList.toggle('completed'); // Переключаем класс 'completed'
        });

        // 6. Добавляем кнопку удаления в listItem
        listItem.appendChild(deleteBtn);

        // 7. Добавляем новый listItem в ul
        taskList.appendChild(listItem);

        // 8. Очищаем поле ввода
        taskInput.value = '';
        taskInput.focus(); // Возвращаем фокус на поле ввода для удобства
    }

    // Добавляем обработчик события для кнопки "Добавить"
    addTaskBtn.addEventListener('click', addTask);

    // Добавляем обработчик события для Enter в поле ввода
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { // Проверяем, была ли нажата клавиша Enter
            addTask(); // Вызываем функцию добавления задачи
        }
    });

    // Опционально: При загрузке страницы можно проверить Local Storage и загрузить задачи
    // Эта часть сложнее, если интересно, можем обсудить позже.
    // Например: loadTasksFromLocalStorage();
    