using Base: JLOptions

using Test: @test, @testset, @test_throws

using Suppressor: @capture_err

using SimpleMock

@testset "SimpleMock.jl" begin
    @testset "Mock type" begin
        include("mock_type.jl")
    end
    @testset "mock function" begin
        include("mock_fun.jl")
    end
end
