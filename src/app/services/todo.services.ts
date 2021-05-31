import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export default class TodoService {
  constructor() {}
  getTodos() {
    return [
      {
        complete: false,
        id: 1,
        name:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        description:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
      },
      {
        complete: false,
        id: 2,
        name: 'qui est esse',
        description:
          'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla',
      },
      {
        complete: false,
        id: 3,
        name: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
        description:
          'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut',
      },
      {
        complete: false,
        id: 4,
        name: 'eum et est occaecati',
        description:
          'ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit',
      },
      {
        complete: false,
        id: 5,
        name: 'nesciunt quas odio',
        description:
          'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque',
      },
    ];
  }
}
