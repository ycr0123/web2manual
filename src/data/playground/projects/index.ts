// Playground sample projects data
import type { SampleProject } from '@/types/playground';

const todoExpressProject: SampleProject = {
  id: 'todo-express',
  name: 'Todo Express API',
  description: 'Express.js로 구축한 Todo REST API (버그 포함)',
  icon: '🚀',
  difficulty: 'beginner',
  defaultFile: 'index.js',
  files: [
    {
      path: 'index.js',
      name: 'index.js',
      language: 'javascript',
      hasBug: true,
      bugDescription: '에러 핸들러 미들웨어가 없어 예외 발생 시 서버가 크래시됩니다.',
      content: `const express = require('express');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/todos', todoRoutes);

// TODO: 에러 핸들러가 없음 - 버그!
// app.use((err, req, res, next) => { ... });

app.listen(PORT, () => {
  console.log(\`서버가 포트 \${PORT}에서 실행 중입니다\`);
});

module.exports = app;`,
    },
    {
      path: 'routes/todos.js',
      name: 'todos.js',
      language: 'javascript',
      content: `const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// 모든 Todo 조회
router.get('/', async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

// Todo 생성
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: '제목이 필요합니다' });
  }
  const todo = await Todo.create({ title, completed: false });
  res.status(201).json(todo);
});

// Todo 업데이트
router.put('/:id', async (req, res) => {
  const todo = await Todo.update(req.params.id, req.body);
  res.json(todo);
});

// Todo 삭제
router.delete('/:id', async (req, res) => {
  await Todo.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;`,
    },
    {
      path: 'models/todo.js',
      name: 'todo.js',
      language: 'javascript',
      content: `let todos = [];
let nextId = 1;

const Todo = {
  findAll: async () => todos,

  findById: async (id) => todos.find(t => t.id === parseInt(id)),

  create: async ({ title, completed = false }) => {
    const todo = { id: nextId++, title, completed, createdAt: new Date() };
    todos.push(todo);
    return todo;
  },

  update: async (id, data) => {
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) throw new Error('Todo를 찾을 수 없습니다');
    todos[index] = { ...todos[index], ...data };
    return todos[index];
  },

  delete: async (id) => {
    todos = todos.filter(t => t.id !== parseInt(id));
  },
};

module.exports = Todo;`,
    },
    {
      path: 'middleware/auth.js',
      name: 'auth.js',
      language: 'javascript',
      content: `// 인증 미들웨어 (데모용)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다' });
  }

  // 실제 환경에서는 JWT 검증 필요
  if (token === 'demo-token') {
    req.user = { id: 1, name: '데모 사용자' };
    next();
  } else {
    res.status(403).json({ error: '유효하지 않은 토큰입니다' });
  }
};

module.exports = authMiddleware;`,
    },
    {
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      content: `{
  "name": "todo-express-api",
  "version": "1.0.0",
  "description": "Express.js Todo REST API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^3.0.0",
    "supertest": "^6.3.0"
  }
}`,
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# Todo Express API

Express.js로 구축한 간단한 Todo REST API입니다.

## 시작하기

\`\`\`bash
npm install
npm run dev
\`\`\`

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/todos | 모든 Todo 조회 |
| POST | /api/todos | Todo 생성 |
| PUT | /api/todos/:id | Todo 업데이트 |
| DELETE | /api/todos/:id | Todo 삭제 |

## 알려진 버그

- 에러 핸들러 미들웨어 누락
- 입력 유효성 검사 부족`,
    },
  ],
};

const reactCounterProject: SampleProject = {
  id: 'react-counter',
  name: 'React Counter',
  description: 'useState와 useEffect를 활용한 React 카운터',
  icon: '⚛️',
  difficulty: 'beginner',
  defaultFile: 'src/App.tsx',
  files: [
    {
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      content: `import React from 'react';
import { Counter } from './Counter';

function App() {
  return (
    <div className="app">
      <h1>React 카운터 앱</h1>
      <Counter initialValue={0} />
    </div>
  );
}

export default App;`,
    },
    {
      path: 'src/Counter.tsx',
      name: 'Counter.tsx',
      language: 'typescript',
      content: `import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);
  const [history, setHistory] = useState<number[]>([initialValue]);

  useEffect(() => {
    document.title = \`카운트: \${count}\`;
  }, [count]);

  const increment = () => {
    setCount(prev => prev + 1);
    setHistory(prev => [...prev, count + 1]);
  };

  const decrement = () => {
    setCount(prev => prev - 1);
    setHistory(prev => [...prev, count - 1]);
  };

  const reset = () => {
    setCount(initialValue);
    setHistory([initialValue]);
  };

  return (
    <div className="counter">
      <p className="count">{count}</p>
      <div className="buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>초기화</button>
        <button onClick={increment}>+</button>
      </div>
      <p className="history">히스토리: {history.join(', ')}</p>
    </div>
  );
}`,
    },
    {
      path: 'src/Counter.test.tsx',
      name: 'Counter.test.tsx',
      language: 'typescript',
      content: `import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter 컴포넌트', () => {
  test('초기값이 0으로 렌더링됩니다', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('+ 버튼 클릭 시 카운트가 증가합니다', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('- 버튼 클릭 시 카운트가 감소합니다', () => {
    render(<Counter initialValue={5} />);
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('초기화 버튼 클릭 시 initialValue로 돌아갑니다', () => {
    render(<Counter initialValue={3} />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('초기화'));
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});`,
    },
    {
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      content: `{
  "name": "react-counter",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.7.0",
    "vitest": "^2.0.0"
  }
}`,
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# React Counter

useState와 useEffect를 활용한 React 카운터 앱입니다.

## 주요 기능

- 카운트 증가/감소
- 초기값으로 리셋
- 카운트 히스토리 기록
- 페이지 타이틀 업데이트

## 테스트 실행

\`\`\`bash
npm test
\`\`\``,
    },
  ],
};

const pythonBugfixProject: SampleProject = {
  id: 'python-bugfix',
  name: 'Python 버그 수정',
  description: '오프바이원 에러가 포함된 Python 유틸리티',
  icon: '🐍',
  difficulty: 'intermediate',
  defaultFile: 'main.py',
  files: [
    {
      path: 'main.py',
      name: 'main.py',
      language: 'python',
      hasBug: true,
      bugDescription: '리스트 슬라이싱에서 오프바이원(off-by-one) 에러가 있습니다.',
      content: `from utils import calculate_average, find_max_subarray

def process_scores(scores: list[int]) -> dict:
    """학생 점수를 처리하고 통계를 반환합니다."""
    if not scores:
        return {}

    # 버그: range(len(scores) - 1) 대신 range(len(scores))를 사용해야 합니다
    valid_scores = [scores[i] for i in range(len(scores) - 1)]  # 마지막 점수 누락!

    return {
        'average': calculate_average(valid_scores),
        'max': max(valid_scores),
        'min': min(valid_scores),
        'count': len(valid_scores),
    }

def get_top_students(scores: dict[str, int], top_n: int) -> list[str]:
    """상위 n명의 학생을 반환합니다."""
    sorted_students = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    # 버그: top_n + 1로 잘못 슬라이싱
    return [name for name, _ in sorted_students[:top_n + 1]]  # 한 명 더 포함됨!

if __name__ == '__main__':
    scores = [85, 92, 78, 95, 88, 76]
    result = process_scores(scores)
    print(f"처리된 점수 통계: {result}")

    student_scores = {'Alice': 92, 'Bob': 85, 'Charlie': 78, 'Diana': 95}
    top = get_top_students(student_scores, 2)
    print(f"상위 2명: {top}")`,
    },
    {
      path: 'utils.py',
      name: 'utils.py',
      language: 'python',
      hasBug: true,
      bugDescription: 'calculate_average에서 ZeroDivisionError 처리가 없습니다.',
      content: `def calculate_average(numbers: list[float]) -> float:
    """숫자 리스트의 평균을 계산합니다."""
    # 버그: 빈 리스트 처리 없음 - ZeroDivisionError 발생 가능!
    return sum(numbers) / len(numbers)

def find_max_subarray(arr: list[int]) -> tuple[int, int, int]:
    """최대 합 부분 배열을 찾습니다 (Kadane's algorithm)."""
    if not arr:
        return (0, 0, 0)

    max_sum = arr[0]
    current_sum = arr[0]
    start = end = temp_start = 0

    for i in range(1, len(arr)):
        if current_sum + arr[i] < arr[i]:
            current_sum = arr[i]
            temp_start = i
        else:
            current_sum += arr[i]

        if current_sum > max_sum:
            max_sum = current_sum
            start = temp_start
            end = i

    return (max_sum, start, end)

def normalize_scores(scores: list[float], min_val: float = 0, max_val: float = 100) -> list[float]:
    """점수를 정규화합니다."""
    score_min = min(scores)
    score_max = max(scores)

    # 버그: score_max == score_min일 때 ZeroDivisionError
    return [(s - score_min) / (score_max - score_min) * (max_val - min_val) + min_val
            for s in scores]`,
    },
    {
      path: 'test_main.py',
      name: 'test_main.py',
      language: 'python',
      content: `import pytest
from main import process_scores, get_top_students

class TestProcessScores:
    def test_empty_list(self):
        assert process_scores([]) == {}

    def test_single_score(self):
        result = process_scores([85])
        assert result['count'] == 1
        assert result['average'] == 85

    def test_multiple_scores(self):
        scores = [80, 90, 70, 85]
        result = process_scores(scores)
        # 버그로 인해 이 테스트가 실패합니다
        assert result['count'] == 4  # 현재 3을 반환

class TestGetTopStudents:
    def test_top_2_students(self):
        scores = {'Alice': 92, 'Bob': 85, 'Charlie': 78, 'Diana': 95}
        result = get_top_students(scores, 2)
        # 버그로 인해 이 테스트가 실패합니다
        assert len(result) == 2  # 현재 3을 반환
        assert 'Diana' in result
        assert 'Alice' in result`,
    },
    {
      path: 'requirements.txt',
      name: 'requirements.txt',
      language: 'text',
      content: `pytest>=7.0.0
pytest-cov>=4.0.0`,
    },
  ],
};

const apiTestingProject: SampleProject = {
  id: 'api-testing',
  name: 'API Testing Suite',
  description: 'TypeScript Express API (테스트 없음)',
  icon: '🧪',
  difficulty: 'intermediate',
  defaultFile: 'server.ts',
  files: [
    {
      path: 'server.ts',
      name: 'server.ts',
      language: 'typescript',
      content: `import express from 'express';
import { userRouter } from './routes/users';
import { validateMiddleware } from './middleware/validate';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(validateMiddleware);
app.use('/api/users', userRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app };

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(\`API 서버가 포트 \${PORT}에서 실행 중\`);
  });
}`,
    },
    {
      path: 'routes/users.ts',
      name: 'users.ts',
      language: 'typescript',
      content: `import { Router } from 'express';
import type { User, CreateUserRequest } from '../types';

export const userRouter = Router();

const users: User[] = [];
let nextId = 1;

userRouter.get('/', (req, res) => {
  res.json(users);
});

userRouter.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  }
  res.json(user);
});

userRouter.post('/', (req, res) => {
  const { name, email } = req.body as CreateUserRequest;
  const user: User = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  res.status(201).json(user);
});

userRouter.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  }
  users.splice(index, 1);
  res.status(204).send();
});`,
    },
    {
      path: 'models/user.ts',
      name: 'user.ts',
      language: 'typescript',
      content: `import type { User } from '../types';

export class UserModel {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      id: this.nextId++,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}`,
    },
    {
      path: 'middleware/validate.ts',
      name: 'validate.ts',
      language: 'typescript',
      content: `import type { Request, Response, NextFunction } from 'express';

export function validateMiddleware(req: Request, res: Response, next: NextFunction) {
  // Content-Type 검증 (POST, PUT, PATCH)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(415).json({
        error: 'Content-Type은 application/json이어야 합니다',
      });
    }
  }
  next();
}`,
    },
    {
      path: 'types/index.ts',
      name: 'index.ts',
      language: 'typescript',
      content: `export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}`,
    },
    {
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      content: `{
  "name": "api-testing-suite",
  "version": "1.0.0",
  "description": "TypeScript Express API (테스트 없음)",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node server.ts",
    "build": "tsc",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "typescript": "^5.7.0",
    "vitest": "^2.0.0"
  }
}`,
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# API Testing Suite

TypeScript Express API 서버입니다. 테스트가 없어서 Claude Code로 테스트를 생성해보세요!

## 엔드포인트

- GET /api/users - 모든 사용자 조회
- GET /api/users/:id - 특정 사용자 조회
- POST /api/users - 사용자 생성
- DELETE /api/users/:id - 사용자 삭제
- GET /health - 헬스 체크

## Claude Code로 테스트 생성

\`\`\`
claude "write tests for server.ts"
\`\`\``,
    },
  ],
};

export const SAMPLE_PROJECTS: SampleProject[] = [
  todoExpressProject,
  reactCounterProject,
  pythonBugfixProject,
  apiTestingProject,
];

export function getProjectById(id: string): SampleProject | undefined {
  return SAMPLE_PROJECTS.find(p => p.id === id);
}
