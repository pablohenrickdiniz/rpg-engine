

describe("Animation Tests",function(){
    var Animation = window.Animation;
    var animation = new Animation();
    var int = /-?[0-9]+/;
    var positive_int = /[0-9]+/;
    var positive_number = /[0-9]+(\.[0-9]+)?/;

    it("default values",function(){
        expect(positive_number.test(animation.fps)).toBeTruthy();
        expect(animation.fps).toBeGreaterThan(0);
        expect(animation.fps).toBeCloseTo(3);
        expect(positive_int.test(animation.end_time)).toBeTruthy();
        expect(animation.running).toBeFalsy();
    });

    it("positive integer index frame",function(){
        var index = animation.getIndexFrame();
        expect(positive_int.test(index)).toBeTruthy();
    });

    it("test execution",function(){
       animation.execute();
       expect(animation.running).toBeTruthy();
       animation.stop();
       expect(animation.running).toBeFalsy();
    });
});

