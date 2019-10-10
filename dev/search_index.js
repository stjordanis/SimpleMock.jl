var documenterSearchIndex = {"docs":
[{"location":"#","page":"Home","title":"Home","text":"CurrentModule = SimpleMock","category":"page"},{"location":"#SimpleMock-1","page":"Home","title":"SimpleMock","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"SimpleMock","category":"page"},{"location":"#SimpleMock.SimpleMock","page":"Home","title":"SimpleMock.SimpleMock","text":"A basic mocking module, inspired by Python's unittest.mock and implemented with Cassette.\n\n\n\n\n\n","category":"module"},{"location":"#The-Mock-object-1","page":"Home","title":"The Mock object","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Mock\ncalls\nncalls\ncalled\ncalled_once\ncalled_with\ncalled_once_with\nCall\nhas_call\nhas_calls\nreset!","category":"page"},{"location":"#SimpleMock.Mock","page":"Home","title":"SimpleMock.Mock","text":"Mock(; return_value=Mock(), side_effect=nothing)\n\nCreate a new mocking object that can act as a replacement for a function.\n\nReturn Value\n\nUse the return_value keyword to set the value to be returned upon calling the mock. By default, the return value is a new Mock.\n\nSide Effects\n\nUse the side_effect keyword to set a side effect to occur upon calling the mock.\n\nIf the value is an Exception, then the exception is thrown.\nIf the value is callable, then it is called with the same arguments and keywords.\nIf the value is a Vector, then each call uses the next element.\nAny other value except nothing is returned without modification.\n\n\n\n\n\n","category":"type"},{"location":"#SimpleMock.calls","page":"Home","title":"SimpleMock.calls","text":"calls(::Mock) -> Vector{Call}\n\nReturn the call history of the Mock.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.ncalls","page":"Home","title":"SimpleMock.ncalls","text":"ncalls(::Mock) -> Int\n\nReturn the number of times that the Mock has been called.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.called","page":"Home","title":"SimpleMock.called","text":"called(::Mock) -> Bool\n\nReturn whether or not the Mock has been called.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.called_once","page":"Home","title":"SimpleMock.called_once","text":"called_once(::Mock) -> Bool\n\nReturn whether or not the Mock has been called exactly once.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.called_with","page":"Home","title":"SimpleMock.called_with","text":"called_with(::Mock, args...; kwargs...) -> Bool\n\nReturn whether or not the Mock has been called with the given arguments.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.called_once_with","page":"Home","title":"SimpleMock.called_once_with","text":"called_once_with(::Mock, args...; kwargs...) -> Bool\n\nReturn whether or not the Mock has been called exactly once with the given arguments.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.Call","page":"Home","title":"SimpleMock.Call","text":"Call(args...; kwargs...)\n\nRepresents a function call.\n\n\n\n\n\n","category":"type"},{"location":"#SimpleMock.has_call","page":"Home","title":"SimpleMock.has_call","text":"has_call(::Mock, ::Call) -> Bool\n\nSimiliar to called_with, but using a Call.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.has_calls","page":"Home","title":"SimpleMock.has_calls","text":"has_calls(::Mock, ::Calls...) -> Bool\n\nReturn whether or not the Mock has a particular ordered sequence of Calls.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.reset!","page":"Home","title":"SimpleMock.reset!","text":"reset!(::Mock)\n\nReset a Mock's call history. Side effects and return values are preserved.\n\n\n\n\n\n","category":"function"},{"location":"#The-mock-Function-1","page":"Home","title":"The mock Function","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"mock","category":"page"},{"location":"#SimpleMock.mock","page":"Home","title":"SimpleMock.mock","text":"mock(f::Function[, ctx::Symbol], args...; filters::Vector{<:Function}=Function[])\n\nRun f with specified functions mocked out.\n\nnote: Note\nMocking functions with keyword arguments is only partially supported. See the \"Keyword Arguments\" section below for more details.\n\nExamples\n\nMocking a single function:\n\nf(x) = x + 1\nmock(+) do plus\n    @assert plus isa Mock\n    @assert f(0) != 1  # The call to + is mocked.\n    @assert called_once_with(p, 0, 1)\nend\n\nMocking a function with a custom Mock:\n\nmock((+) => Mock(; return_value=1)) do plus\n    @assert 1 + 1 == 1\n    @assert called_once_with(plus, 1, 1)\nend\n\nMocking methods that match a given signature:\n\nmock((+, Float64, Float64) => Mock(; side_effect=(a, b) -> 2a + 2b)) do plus\n    @assert 1 + 1 == 2\n    @assert 2.0 + 2.0 == 8\n    @assert called_once_with(plus, 2.0, 2.0)\nend\n\nMocking with something other than a Mock:\n\nmock((+) => (a, b) -> 2a + 2b) do _plus\n    @assert 1 + 2 == 6\nend\n\nUsing Filters\n\nOftentimes, you mock a function with a very specific idea of where you want that mocking to happen. It can be confusing when a call you didn't anticipate gets mocked somewhere deep in the call stack, botching everything. To avoid this, you can use filter functions like so:\n\nf(x, y) = x + y\ng(x, y) = f(x, y)\nmock((+) => Mock(; side_effect=(a, b) -> 2a + b); filters=[max_depth(2)]) do plus\n    @assert f(1, 2) == 4  # The call depth of + here is 2.\n    @assert g(3, 4) == 7  # Here, it's 3.\n    @assert called_once_with(plus, 1, 2)\nend\n\nFilter functions take a single argument of type Metadata. If any filter rejects, then mocking is not performed. See Filter Functions for a list of included filters, as well as building blocks for you to create your own.\n\nReusing Contexts\n\nUnder the hood, this function creates a new Cassette Context on every call by default. This provides a nice clean mocking environment, but it can be slow to create and call new types and methods over and over. If you find yourself repeatedly mocking the same set of functions, you can specify a context name to reuse that context like so:\n\nctx = gensym()\nmock(g -> @assert(!called(g)), ctx, get)\n# This one is faster, especially when there's a lot going on in your mock blocks.\nmock(g -> @assert(!called(g)), ctx, get)\n\nKeyword Arguments\n\nMocking of functions with keyword arguments is fully supported when the following conditions are met:\n\nFilter functions are not used\nThe context in use has no previously-mocked functions that are now unmocked\n\nif a filter function rejects and calls a mocked function (instead of its mock), that call will have no keywords.\n\nIf you reuse a context that has previously mocked some function, unmocked calls to that function will have no keywords. For example:\n\nkwfunc(; kwargs...) = nothing\ncalls_kwfunc(; kwargs...) = kwfunc(; kwargs...)\nctx = gensym()\nmock(ctx, calls_kwfunc) do c\n    calls_kwfunc(; x=1, y=2)\n    @assert called_once_with(c; x=1, y=2)\nend\nmock(ctx, kwfunc) do k\n    calls_kwfunc(; x=1, y=2)               # This will issue a warning.\n    @assert called_once_with(k; x=1, y=2)  # This will fail!\nend\n\nIn short, avoid using filters and reusing contexts when mocking functions that accept keywords.\n\n\n\n\n\n","category":"function"},{"location":"#Filter-Functions-1","page":"Home","title":"Filter Functions","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"max_depth\nmin_depth\nexcluding\nincluding\nMetadata\ncurrent_depth\ncurrent_function\ncurrent_module","category":"page"},{"location":"#SimpleMock.max_depth","page":"Home","title":"SimpleMock.max_depth","text":"max_depth(n::Int) -> Function\n\nCreate a filter that rejects when the current call depth is greater than n.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.min_depth","page":"Home","title":"SimpleMock.min_depth","text":"min_depth(n::Int) -> Function\n\nCreate a filter that rejects when the current call depth is less than n.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.excluding","page":"Home","title":"SimpleMock.excluding","text":"excluding(args...) -> Function\n\nCreate a filter that rejects when the calling function or module is in args.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.including","page":"Home","title":"SimpleMock.including","text":"including(args...) -> Function\n\nCreate a filter that rejects when the calling function or module is not in args.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.Metadata","page":"Home","title":"SimpleMock.Metadata","text":"Container for mocks and bookkeeping data. Instances of this type are aware of the call depth (current_depth) and the current function/module (current_function/current_module).\n\nAll filter functions take a single argument of this type.\n\n\n\n\n\n","category":"type"},{"location":"#SimpleMock.current_depth","page":"Home","title":"SimpleMock.current_depth","text":"current_depth(::Metadata) -> Int\n\nReturn the current call depth (the size of the call stack). The depth is always positive, so the first function entered has a depth of 1.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.current_function","page":"Home","title":"SimpleMock.current_function","text":"current_function(::Metadata) -> Any\n\nReturn the current function (or other callable thing). In this case, \"current\" refers, somewhat counterintuitively, not to the function about to be called, but to the function that is about to call it.\n\nTo illustrate:\n\nf(x) = x\ng(x) = f(x)\nx = g(1)\n\nIn this case, when the call to f is reached, the function that is calling f is g. Therefore, the \"current\" function is g.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleMock.current_module","page":"Home","title":"SimpleMock.current_module","text":"current_module(m::Metadata) -> Module\n\nReturn the current module, where \"current\" has the same definition as in current_function.\n\n\n\n\n\n","category":"function"},{"location":"#Index-1","page":"Home","title":"Index","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"","category":"page"}]
}
