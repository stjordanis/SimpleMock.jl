using Base: JLOptions

using Test: @test, @testset, @test_throws

using Suppressor: @capture_err

using SimpleMock

@testset "SimpleMock.jl" begin
    @testset "Basic Mock behaviour" begin
        m = Mock()
        @test isempty(calls(m))
        @test ncalls(m) == 0
        @test !called(m)
        @test !called_once(m)
        @test !called_with(m)
        @test !called_once_with(m)

        m()
        @test length((calls(m))) == 1
        @test ncalls(m) == 1
        @test called(m)
        @test called_once(m)
        @test called_with(m)
        @test called_once_with(m)

        m(1)
        @test !called_once(m)
        @test called_with(m, 1)
        @test !called_once_with(m, 1)

        m(1; x=2)
        @test called_with(m, 1; x=2)
    end

    @testset "has_calls" begin
        m = Mock()
        @test has_calls(m)
        @test !has_calls(m, Call())

        m()
        @test has_calls(m, Call())
        @test !has_calls(m, Call(1))
        @test !has_calls(m, Call(; x=1))
        @test !has_calls(m, Call(), Call())

        m(1)
        @test has_calls(m, Call(), Call(1))

        m(2)
        m(3)
        m(4)
        @test has_calls(m, Call(2), Call(3))
        @test !has_calls(m, Call(2), Call(4))

        m(; x=1)
        @test has_calls(m, Call(4), Call(; x=1))
    end

    @testset "reset!" begin
        m = Mock()
        foreach(m, 1:10)
        reset!(m)
        @test !called(m)
    end

    @testset "Return values" begin
        m = Mock()
        @test m() isa Mock
        @test m(1; x=1) isa Mock

        m = Mock(; return_value=1)
        @test m() == 1
        @test m(1; x=1) == 1
    end

    @testset "Side effects" begin
        m = Mock(; side_effect=1)
        @test m() == 1
        @test m(1, x=1) == 1

        m = Mock(; side_effect=[1, 2, 3])
        @test m() == 1
        @test m() == 2
        @test m() == 3
        @test_throws ArgumentError m()

        m = Mock(; side_effect=iseven)
        @test !m(1)
        @test m(2)

        m = Mock(; side_effect=KeyError(1))
        @test_throws KeyError m()

        m = Mock(; side_effect=[KeyError(1), ArgumentError("foo")])
        @test_throws KeyError m()
        @test_throws ArgumentError m()

        m = Mock(; side_effect=[KeyError(1), 1, ArgumentError("foo")])
        @test_throws KeyError m()
        @test m() == 1
        @test_throws ArgumentError m()

        m = Mock(; return_value=1, side_effect=2)
        @test m() == 2
    end

    o = JLOptions()
    if o.warn_overwrite == 0
        # https://github.com/fredrikekre/jlpkg/blob/3b1c2400932dbe13fa7c3cba92bde3842315976c/src/cli.jl#L151-L160
        args = map(n -> n === :warn_overwrite ? 1 : getfield(o, n), fieldnames(JLOptions))
        o2 = JLOptions(args...)
        unsafe_store!(cglobal(:jl_options, JLOptions), o2)
    end
    @testset "mock on the same Coxntext does not overwrite methods" begin
        Ctx = gensym()
        mock(identity, Ctx, identity)
        out = @capture_err mock(identity, Ctx, identity)
        @test isempty(out)
    end

    @testset "mock" begin
        # We're not using @test in the mock block because it breaks everything (#2).

        result = mock(get) do get
            Base.get()
            called_once_with(get)
        end
        @test result

        result = mock(identity) do ident
            identity(1, 2, 3)
            identity()
            [
                called(ident),
                called_with(ident, 1, 2, 3),
                !called_once(ident),
                ncalls(ident) == 2,
                has_call(ident, Call(1, 2, 3)),
                has_calls(ident, Call(1, 2, 3), Call()),
            ]
        end
        @test all(result)
    end
end