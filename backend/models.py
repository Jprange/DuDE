class Program(object):
    def __init__(self, statements):
        self.statements = statements
        self.states = []
        self.current_state = {}

    def evaluate(self):
        for s in self.statements:
            Statement(s['id'], s['type'], s.get('data', None),
                      self.current_state, self.states)()

        return self.states



class Statement(object):

    def __init__(self, id, type, data, current_state, states):
        self.id = id
        self.type = type
        self.data = data
        self.current_state = current_state
        self.states = states

    def __call__(self):

        globals().update(self.current_state)

        if self.type == 'assignment':
            varname = self.data['varname']
            expr = self.data['expr']

            self.current_state[varname] = eval(expr)

            self.states.append({'id': self.id, 'state': self.current_state.copy()})

        elif self.type == 'if':
            predicate = self.data['predicate']
            branch = self.data['branch']

            self.states.append({'id': self.id, 'state': self.current_state.copy()})

            if eval(predicate):
                for s in branch:
                    Statement(s['id'],s['type'],s['data'],
                              self.current_state, self.states)()

        elif self.type == 'loop':
            predicate = self.data['predicate']
            branch = self.data['branch']

            self.states.append({'id': self.id, 'state': self.current_state.copy()})

            while eval(predicate):
                for s in branch:
                    Statement(s['id'],s['type'],s['data'],
                              self.current_state, self.states)()

        elif self.type in ('endif', 'begin', 'endloop'):
            self.states.append({'id': self.id, 'state': self.current_state.copy()})

        else:
            raise AttributeError('Invalid type: <{}>'.format(self.type))
